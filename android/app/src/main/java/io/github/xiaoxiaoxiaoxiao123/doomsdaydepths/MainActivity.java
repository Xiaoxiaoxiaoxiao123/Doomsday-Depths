package io.github.xiaoxiaoxiaoxiao123.doomsdaydepths;

import android.app.Activity;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;
import androidx.webkit.WebViewAssetLoader;
import java.io.ByteArrayInputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class MainActivity extends Activity {
    private static final int IMPORT_SAVE=1, EXPORT_SAVE=2;
    private WebView web;
    private ValueCallback<Uri[]> fileCallback;
    private String pendingExport;
    private boolean local(Uri u) { return "https".equals(u.getScheme()) && "appassets.androidplatform.net".equals(u.getHost()); }

    @Override public void onCreate(Bundle saved) {
        super.onCreate(saved);
        web=new WebView(this);
        setContentView(web);
        web.getSettings().setJavaScriptEnabled(true);
        web.getSettings().setDomStorageEnabled(true);
        web.getSettings().setAllowFileAccess(false);
        web.getSettings().setAllowContentAccess(true);
        WebViewAssetLoader loader=new WebViewAssetLoader.Builder().addPathHandler("/assets/",new WebViewAssetLoader.AssetsPathHandler(this)).build();
        web.setWebViewClient(new WebViewClient() {
            @Override public WebResourceResponse shouldInterceptRequest(WebView view,WebResourceRequest req) {
                WebResourceResponse content=loader.shouldInterceptRequest(req.getUrl());
                return content!=null?content:new WebResourceResponse("text/plain","utf-8",new ByteArrayInputStream(new byte[0]));
            }
            @Override public boolean shouldOverrideUrlLoading(WebView view,WebResourceRequest req) { return !local(req.getUrl()); }
        });
        web.setWebChromeClient(new WebChromeClient() {
            @Override public boolean onShowFileChooser(WebView view,ValueCallback<Uri[]> callback,FileChooserParams params) {
                if(fileCallback!=null)fileCallback.onReceiveValue(null);
                fileCallback=callback;
                Intent intent=new Intent(Intent.ACTION_OPEN_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json");
                try { startActivityForResult(intent,IMPORT_SAVE); } catch(Exception ex) { fileCallback.onReceiveValue(null);fileCallback=null; }
                return true;
            }
        });
        web.addJavascriptInterface(new SaveBridge(),"AndroidBridge");
        web.loadUrl("https://appassets.androidplatform.net/assets/index.html");
    }
    public class SaveBridge {
        @JavascriptInterface public void exportSave(String data) {
            if(data==null||data.length()>1000000)return;
            runOnUiThread(()->{
                if(!local(Uri.parse(web.getUrl())))return;
                pendingExport=data;
                Intent intent=new Intent(Intent.ACTION_CREATE_DOCUMENT).addCategory(Intent.CATEGORY_OPENABLE).setType("application/json").putExtra(Intent.EXTRA_TITLE,"Doomsday-Depths-save.json");
                try { startActivityForResult(intent,EXPORT_SAVE); } catch(Exception ex) { Toast.makeText(MainActivity.this,"无法打开文件保存窗口",Toast.LENGTH_LONG).show(); }
            });
        }
    }
    @Override protected void onActivityResult(int request,int result,Intent data) {
        super.onActivityResult(request,result,data);
        if(request==IMPORT_SAVE&&fileCallback!=null) { fileCallback.onReceiveValue(result==RESULT_OK&&data!=null?new Uri[]{data.getData()}:null);fileCallback=null; }
        if(request==EXPORT_SAVE) {
            if(result==RESULT_OK&&data!=null&&data.getData()!=null&&pendingExport!=null) {
                try(OutputStream stream=getContentResolver().openOutputStream(data.getData())) { stream.write(pendingExport.getBytes(StandardCharsets.UTF_8));Toast.makeText(this,"存档已导出",Toast.LENGTH_SHORT).show(); }
                catch(Exception ex) { Toast.makeText(this,"存档导出失败",Toast.LENGTH_LONG).show(); }
            }
            pendingExport=null;
        }
    }
    @Override public void onBackPressed() { web.evaluateJavascript("(()=>{const d=document.getElementById('dialog');if(d&&d.open){d.close();return true;}return false;})()",value->{if(!"true".equals(value))finish();}); }
    @Override protected void onPause() { web.evaluateJavascript("(()=>{if(typeof save==='function'){ShelterEngine.settle(state);save();}})()",null);super.onPause(); }
    @Override protected void onDestroy() { if(fileCallback!=null)fileCallback.onReceiveValue(null);web.destroy();super.onDestroy(); }
}
