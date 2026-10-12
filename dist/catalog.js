'use strict';
window.CATEGORIES={living:{name:'生活',color:'#ecd09c',dark:'#806746',desc:'住得安心，吃得温暖'},growth:{name:'种植',color:'#a9c58b',dark:'#4e7147',desc:'让绿色在地下生长'},storage:{name:'储备',color:'#93a4c6',dark:'#536786',desc:'把明天所需留在今天'},culture:{name:'文化',color:'#bca4ce',dark:'#7c608b',desc:'保留知识与记忆'},leisure:{name:'休闲',color:'#d998a4',dark:'#995f6e',desc:'给日常一点轻松时光'}};
// 金额单位：金币；收益与维护费单位：金币/分钟。新增房间只需配置与背景。
window.ROOMS={
 dorm:{name:'宿舍',category:'living',icon:'⌂',capacity:4,cost:200,seconds:0,income:0,expense:3,description:'一张床、一盏灯，为新的居民留一个家。每间宿舍提供 4 个社区床位。'},
 restaurant:{name:'餐厅',category:'living',icon:'♨',capacity:5,cost:350,seconds:60,income:70,expense:12,description:'为社区准备热腾腾的饭菜。擅长生活服务的居民能增加营业收入。'},
 cultivation:{name:'植物栽培室',category:'growth',icon:'❧',capacity:3,cost:250,seconds:30,income:48,expense:6,description:'照看蔬菜与幼苗，收成换来稳定的社区收入。'},
 flowers:{name:'花房',category:'growth',icon:'✿',capacity:2,cost:300,seconds:45,income:38,expense:5,description:'培育花卉，把地下的日常装点得更明亮。'},
 supplies:{name:'物资储备室',category:'storage',icon:'▤',capacity:4,cost:300,seconds:45,income:52,expense:8,description:'整理、保养和调配物资，靠周转获得金币。'},
 granary:{name:'粮仓',category:'storage',icon:'♧',capacity:3,cost:380,seconds:90,income:58,expense:9,description:'储藏粮食、减少损耗，让每一份收成都有价值。'},
 energy:{name:'能源储备室',category:'storage',icon:'ϟ',capacity:2,cost:500,seconds:120,income:54,expense:10,description:'管理电池与能源设备，为社区提供可靠的供能服务。'},
 library:{name:'图书室',category:'culture',icon:'▥',capacity:3,cost:280,seconds:40,income:42,expense:5,description:'整理书籍，开展阅读与学习活动，让知识继续流动。'},
 museum:{name:'博物馆',category:'culture',icon:'♜',capacity:2,cost:650,seconds:300,income:70,expense:14,description:'保存地表的故事，整理展品并组织社区参观。'},
 gym:{name:'健身房',category:'leisure',icon:'↔',capacity:3,cost:400,seconds:90,income:60,expense:10,description:'安排训练、保养器材，帮助居民保持精力。'},
 cinema:{name:'影音室',category:'leisure',icon:'▶',capacity:5,cost:550,seconds:180,income:88,expense:16,description:'播放电影和音乐，给一天的工作一个愉快的结尾。'},
 boardgames:{name:'桌游室',category:'leisure',icon:'⚄',capacity:4,cost:420,seconds:100,income:66,expense:9,description:'组织棋局与桌游活动，让居民在这里交到朋友。'}
};
window.SPECIALTIES={living:['生活服务','做饭、照料与社区服务'],growth:['植物培育','育苗、种植与花卉养护'],storage:['物资管理','库存、设备与能源管理'],culture:['知识整理','阅读、藏品与文化活动'],leisure:['活动组织','运动、影音与桌游组织']};
