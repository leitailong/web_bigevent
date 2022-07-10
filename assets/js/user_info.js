$(function () {
    var form=layui.form;
    var layer=layui.layer;
    // 为表单添加验证规则
    form.verify({
        nickname: function (value) {
            if(value.length>6){
                return '昵称必须在1~6位字符之间';
            }
        }
    });
    // 初始化用户信息
    init_userinfo();

    function init_userinfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if(res.status!==0){
                    return layer.msg('获取用户信息失败');
                }
                // console.log(res);
                form.val('fm_user_info',res.data);
            }
        });
    }

    // 重置表单的数据
    $('#btnReset').on('click',function (e) {
        e.preventDefault();
        // 调用初始化用户信息进行重新填充数据
        init_userinfo(); 
    });

    // 修改用户信息表单的提交事件
    $('.layui-form').on('submit',function (e) {
        // 阻止表单默认提交行为
        e.preventDefault();
        // 发起Ajax请求 更新用户信息
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if(res.status!==0){
                    return layer.msg('更新用户信息失败');
                }
                layer.msg('更新用户信息成功');
                // 调用index页面中的获取用户信息方法 getUserInfo()
                // 实现页面用户信息和头像的更新
                window.parent.getUserInfo();
            }
        });
    })

});