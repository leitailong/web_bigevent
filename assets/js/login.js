$(function () {
    // 实现点击切换效果
    $('#link_reg').on('click', function () {
        $('.login-box').hide();
        $('.reg-box').show();
    });

    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    });

    // 获取 layui form对象
    var form = layui.form;
    // 获取 layui 的 layer 对象
    var layer=layui.layer;
    // 设置自定义验证规则
    form.verify({
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],
        // 定义校验密码的规则
        repwd: function (value) {
            // 形参是确认密码的内容   
            // 拿到密码框的内容进行判断
            var pwd=$('.reg-box [name=password]').val();
            if(pwd!==value){
                return '两次密码不一致';
            }
        }
    });

    // 监听表单注册事件
    $('#form_reg').on('submit',function (e) {
        // 1.阻止表单的默认提交行为
        e.preventDefault();
        // 2.利用Ajax发起post请求
        var data={username: $('#form_reg [name=username]').val(),password: $('#form_reg [name=password]').val()};
        $.post('/api/reguser',data,function(res){
            if(res.status!==0){
                return layer.msg(res.message);
            }
            layer.msg('注册成功，请登录!');
            // 切换到登录模块
            $('#link_login').click();
        });
        // $.ajax({
        //     method: 'POST',
        //     url: '/api/reguser',
        //     data: {
        //         username: $('#form_reg [name=username]').val(),
        //         password: $('#form_reg [name=password]').val()
        //     },
        //     success: function (res) {
        //         if(res.status!==0){
        //             return console.log(res.message);
        //         }
        //         return console.log(res.message);
        //     }
        // });
    });

    // 监听登录表单提交事件
    $('#form_login').submit(function (e) {
        e.preventDefault();
        $.ajax({
            method:'POST',
            url:'/api/login',
            // serialize()快速获取表单中的数据
            data: $(this).serialize(),
            success: function (res) {
                if(res.status!==0){
                    return layer.msg(res.message);
                }
                layer.msg('登录成功');
                // 将登录成功之后服务器给的token字符串存到本地
                localStorage.setItem('token',res.token);
                location.href='/index.html';
            }
        });
    });
});