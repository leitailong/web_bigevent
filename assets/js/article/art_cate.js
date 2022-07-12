$(function () {
    var layer = layui.layer;
    var form = layui.form;
    initArtCateList();
    // 获取文章列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                var htmlStr = template('tpl-table', res);
                $('.layui-table tbody').html(htmlStr);
            }
        });
    }

    var indexAdd = null;
    //为添加类别按钮绑定点击事件
    $('#btnAddCate').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '240px'],
            title: '添加文章类别',
            content: $('#dialog-add').html()
        });
    });

    // 通过代理的方式为提交按钮绑定事件
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    console.log(res);
                    layer.close(indexAdd);
                    return layer.msg('添加失败');
                }
                layer.msg('添加成功');
                // 关闭弹出层
                layer.close(indexAdd);
                // 调用获取分类函数进行刷新页面
                initArtCateList();
            }
        });
    });

    // 通过代理的方式为编辑按钮添加弹出层
    var indexEdit = null;
    $('tbody').on('click', '#btnEdit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '240px'],
            title: '修改文章信息',
            content: $('#dialog-edit').html()
        });

        // 获取所点击行的id
        var id = $(this).attr('data-id');
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('edit', res.data);
            }
        });

    });

    // 通过代理监听确认修改按钮的提交事件
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改失败');
                }
                layer.msg('修改成功');
                layer.close(indexEdit);
                // 调用获取分类函数进行刷新页面
                initArtCateList();
            }
        });
    });

    // 为删除按钮绑定事件
    $('tbody').on('click', '#btn-del', function () {
        var id = $(this).attr('data-id');
        // 提示用户是否确认要删除
        layer.confirm('确定要删除吗？', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/'+id,
                success: function (res) {
                    if(res.status!==0){
                        return layer.msg('删除分类失败');
                    }
                    layer.msg('删除分类成功');
                    layer.close(index);
                }
            });
        });
    });

});