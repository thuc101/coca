export default {
    XuLyErr(err) {
        let code = JSON.parse(JSON.stringify(err)).status;
        if (code == 400) {
            let msg = JSON.parse(JSON.stringify(err.response)).data.message;
            alert(msg);
        } else {
            if (err.response) {
                if (err.response.status == 401)
                    alert("Chưa đăng nhập hoặc token hết hạn");
                else if (err.response.status == 403)
                    alert("Bạn ko có quyền");
                else if(err.response.status == 500)    
                    alert("no Authorization");
            } else if (err.request) {
                alert(JSON.stringify(err.request));
            } else if (err.message) {
                alert(JSON.stringify(err.message));
            }
        }
    }
}
  /*
import XuLy from '@/XuLy';
XuLy.XuLyErr(err)
*/
