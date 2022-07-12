$(function () {
    var layer = layui.layer
    var form = layui.form

    //初始化文章类别 
    initCate()

    // 初始化富文本编辑器
    initEditor()

    // 定义初始化文章类别的函数
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章类别失败')
                }
                // 模板引擎对文章类别进行渲染
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    // 为选择封面按钮绑定点击事件处理函数
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click()
    })

    // 监听 coverFile 的 change 事件
    $('#coverFile').on('change', function (e) {
        // 获取选择的文件列表
        var files = e.target.files
        if (files.length === 0) {
            return
        }
        // 拿到获取的文件
        var newImgURL = URL.createObjectURL(files[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域
    })


    // 设置文章发布的状态
    var art_state = '已发布'

    // 为存为草稿按钮绑定事件
    $('#btnSave').on('click', function (e) {
        art_state = '草稿'
    })

    // 为发布按钮绑定事件
    $('#btnSend').on('click', function () {
        art_state = '已发布'
    })

    // 为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 1.基于form表单 快速创建一个formData对象
        var fd = new FormData($(this)[0])
        // 2.将文章的状态追加到formData中
        fd.append('state', art_state)
        // 3.将封面裁剪过后的图片 输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                // 4.调用函数发起ajax请求
                pub_article(fd);
            })
    })

    // 定义发布文章的函数
    function pub_article(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 的格式
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('文章发表失败')
                }
                layer.msg('文章发布成功')
                // 成功之后跳转到文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }


})