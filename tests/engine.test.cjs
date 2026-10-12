const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const ctx={window:null,Date,Math,console};ctx.window=ctx;vm.createContext(ctx);
for(const f of ['catalog.js','engine.js'])vm.runInContext(fs.readFileSync('dist/'+f,'utf8'),ctx);
const E=ctx.ShelterEngine,R=ctx.ROOMS,now=1700000000000;
const near=(a,b)=>assert.ok(Math.abs(a-b)<1e-6,`${a} != ${b}`);
assert.equal(Object.keys(R).length,12);
for(const t of Object.values(R)){assert.ok(t.capacity>=2&&t.capacity<=5);assert.ok(t.seconds>=0&&t.seconds<=300);}
let s=E.fresh(now);assert.ok(E.validate(s));near(E.net(s,now),23.5);
E.settle(s,now+60000);near(s.coins,1023.5);E.settle(s,now+60000);near(s.coins,1023.5);
// 分工变更前结算旧收益；匹配特长增加个人收益 25%。
s=E.fresh(now);s.people[2].specialty='growth';assert.ok(E.assign(s,3,2,now+60000).ok);near(s.coins,1023.5);near(E.roomRate(s,s.floors[1],now+60000).income,40);
assert.ok(E.assign(s,4,2,now+60000).ok);assert.equal(E.assign(s,2,2,now+60000).ok,false);assert.equal(s.people[1].floor,3);
// 付款只发生一次；建造中不能安排人，未完工不计维护费。
s=E.fresh(now);let b=E.build(s,'museum',now);assert.ok(b.ok);near(s.coins,350);assert.equal(b.floor.readyAt,now+300000);assert.equal(E.assign(s,3,b.floor.id,now).ok,false);near(E.roomRate(s,b.floor,now).net,0);
// 离线结算跨越完工时刻：先 5 分钟旧净收入，再 1 分钟新增维护费。
E.settle(s,now+360000);near(s.coins,350+23.5*5+9.5);assert.ok(E.assign(s,3,b.floor.id,now+360000).ok);
const rate=E.net(s,now+360000);E.toggle(s,b.floor.id,now+420000);near(s.coins,350+23.5*5+9.5+rate);near(E.roomRate(s,b.floor,now+420000).net,0);
// 立即完成的宿舍扩展床位，访客严格按目的地送达，满床时只给小费。
s=E.fresh(now);assert.equal(E.deliver(s,5,1,now).ok,false);const delivery=E.deliver(s,5,2,now);assert.ok(delivery.ok);assert.equal(delivery.joined,false);assert.equal(s.people.length,4);near(s.coins,1025);
const dorm=E.build(s,'dorm',now);assert.equal(dorm.floor.readyAt,now);assert.equal(E.beds(s,now),8);E.arrival(s,now+45000);const v=s.visitors[0],look=JSON.stringify(v.look);const joined=E.deliver(s,v.id,v.destination,now+45000);assert.equal(joined.joined,true);assert.equal(JSON.stringify(s.people.at(-1).look),look);assert.ok(E.validate(s));
const restored=JSON.parse(JSON.stringify(s));assert.ok(E.validate(restored));assert.equal(JSON.stringify(restored.people.at(-1).look),look);
// 离线最长 8 小时，余额不能为负；重放同一时间不重复结算。
s=E.fresh(now);E.settle(s,now+24*3600000);near(s.coins,1000+23.5*480);E.settle(s,now+24*3600000);near(s.coins,1000+23.5*480);
s=E.fresh(now);s.people.forEach(p=>p.floor=null);s.coins=1;E.settle(s,now+60000);near(s.coins,0);
s=E.fresh(now);s.coins=0;assert.equal(E.build(s,'flowers',now).ok,false);assert.equal(s.floors.length,3);
// 旧版迁移保留金币、人数和楼层，超容量人员转为待安排。
const old={version:1,coins:1234,rooms:[{type:'home'},{type:'food'},{type:'water'}],people:Array.from({length:5},(_,i)=>({name:'旧居民'+i,room:1}))};s=E.migrate(old,now);assert.equal(s.coins,1234);assert.equal(s.people.length,5);assert.equal(E.assigned(s,s.floors[1]).length,3);assert.ok(E.validate(s));
const bad=JSON.parse(JSON.stringify(s));bad.people[0].look.head=99;assert.equal(E.validate(bad),false);bad.people[0].look.head=0;bad.floors[0].capacity=6;assert.equal(E.validate(bad),false);
console.log('PASS: 12 room specs, income/expenses, specialties, capacity, build timers, pause, elevator, housing, offline cap, persistence, migration, invalid saves.');
// 到达目标层的未入住访客仍可见，停留 60 秒，且不参与产出。
s=E.fresh(now);const before=E.net(s,now);let result=E.deliver(s,5,2,now);assert.equal(result.joined,false);assert.equal(E.present(s,s.floors[1],now).guests[0].person.id,5);near(E.net(s,now),before);assert.ok(E.validate(JSON.parse(JSON.stringify(s))));assert.equal(E.present(s,s.floors[1],now+60000).guests.length,0);assert.ok(E.pruneVisits(s,now+60000));
// 有床位、有目标层空位：入住并直接显示为该层居民（包括宿舍）。
s=E.fresh(now);E.build(s,'dorm',now);result=E.deliver(s,5,2,now);assert.equal(result.placed,true);assert.equal(s.people.find(p=>p.id===5).floor,2);assert.equal(E.present(s,s.floors[1],now).workers.some(p=>p.id===5),true);assert.equal(E.present(s,s.floors[1],now).guests.length,0);
// 房间已满时在入口候场，不突破最大人数，也不改变实际收支。
s=E.fresh(now);E.assign(s,3,2,now);E.assign(s,4,2,now);const rateBefore=E.net(s,now);E.deliver(s,5,2,now);const presence=E.present(s,s.floors[1],now);assert.equal(presence.workers.length,3);assert.equal(presence.guests.length,0);assert.equal(presence.overflow.length,1);near(E.net(s,now),rateBefore);
console.log('PASS: arrived guest visibility, direct resident placement, full-room landing, visitor expiration, no visitor income.');
