$(function () {
    // 调用获取用户信息的函数
    getUserInfo();
    var layer=layui.layer;
    // 监听退出系统事件
    $('#exit').on('click', function () {
        layer.confirm('是否退出系统?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            // 1.清空本地存储的内容
            localStorage.removeItem('token');
            // 2.跳转到登录界面 
            location.href='./login.html';
            // 关闭弹框
            layer.close(index);
        });

    });

});

// 获取用户信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败');
            }
            // 调用渲染用户头像信息函数、
            renderAvatar(res.data);
        }
    });
}

// 渲染用户头像函数
function renderAvatar(user) {
    // 获取用户的 nickname 如果没有则获取用户名
    var name = user.nickname || user.username;
    // 渲染欢迎文字
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    // 判断用户是否有头像 如果没有则渲染文字头像
    if (user.user_pic !== null) {
        $('.text-avatar').hide();
        $('.layui-nav-img').attr('src', user.user_pic).show();
    } else {
        $('.layui-nav-img').hide();
        var firstName = name[0].toUpperCase();
        $('.text-avatar').html(firstName).show();
    }
}