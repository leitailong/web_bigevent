$(function () {
    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;
    // 定义美化时间的过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date);
        var y = dt.getFullYear();
        var m = padZero(dt.getMonth() + 1);
        var d = padZero(dt.getDay());
        var hh = padZero(dt.getHours());
        var mm = padZero(dt.getMinutes());
        var ss = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss;
    }

    // 定义补零函数
    function padZero(n) {
        return n > 9 ? n : '0' + n;
    }

    // 定义一个查询对象 将来请求数据时 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值 默认请求第一页的数据
        pagesize: 2, //每页显示几条数据 默认2条
        cate_id: '', //文章分类的 Id
        state: '' //文章的发布状态
    };

    // 获取文章数据
    initTable();
    // 初始化文章分类列表
    initCate();

    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败');
                }
                // 模板引擎渲染数据
                var htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            }
        });
    }

    // 初始化文章分类列表
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败');
                }
                // 调用模板引擎渲染分类的可选项数据
                var htmlStr = template('tpl-list', res);
                // console.log(htmlStr+'ok');
                $('[name=cate_id]').html(htmlStr);
                // 通知 layui 重新渲染表单区域的 ui 结构
                form.render();
            }
        });
    }

    // 为筛选表单添加 submit 提交事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault();
        // 1.获取表单选中项的值 
        var cate_id = $('[name=cate_id]').val();
        var state = $('[name=state]').val();
        // 2.为查询参数q中对应的属性赋值
        q.cate_id = cate_id;
        q.state = state;
        // 3.根据最新的筛选条件 重新渲染表格的数据
        initTable();
    });


    // 渲染分页方法
    function renderPage(total) {
        // 调用 laypage.render() 方法渲染分页的结构
        laypage.render({
            elem: 'pageBox', //分页容器id
            count: total, //总数据条数
            limit: q.pagesize, //每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页发生切换时 触发jump回调
            // 触发jump回调的方式有两种
            // 1.点击页码时 会触发jump回调
            // 2.只要调用了 laypage.render() 方法 就会触发 jump 回调
            // 
            jump: function (obj, first) {
                // 可以通过 first 的值 判断是哪种方式 触发的jump回调
                // 如果 first 的值为 true 证明是方式 2 触发的
                // 否则就是方式 1 触发的
                // 把最新的页码值赋值到 q 这个查询参数上
                q.pagenum = obj.curr;
                // 把最新的条目数 赋值到q这个查询参数对象的pagesize属性中
                q.pagesize = obj.limit;
                // 根据最新的q渲染对应的数据列表
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 通过代理的方式为删除按钮绑定事件
    $('tbody').on('click', '#btn-del', function () {
        // 获取当前页面删除按钮的个数
        var len = $('#btn-del').length;
        // 获取要删除文章的id
        var id = $(this).attr('data-id');
        // 询问用户是否确认删除数据
        layer.confirm('确定要删除吗?', {
            icon: 3,
            title: '提示'
        }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败');
                    }
                    layer.msg('删除成功');
                    // 当数据删除完成之后 需判断当前这一页中
                    // 是否还有剩余的数据 如果没有剩余数据
                    // 则让页码值 -1 之后 重新调用 initTable方法
                    if (len === 1) {
                        // 证明删除完毕后 页面没有剩余的数据了
                        // 页码值需要减一
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;

                    }
                    initTable();
                }
            });
            layer.close(index);
        });
    });

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 初始化富文本编辑器
    initEditor()

    // 通过代理的方式为删除绑定事件
    $('tbody').on('click', '#btn-edit', function () {
        $('#list').hide().siblings('#edit').show();
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/' + id,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取信息失败')
                }
                form.val('form-edit', res.data)
            }
        })
    })

});