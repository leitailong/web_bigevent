$(function () {
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 为上传按钮绑定点击事件
  $('#btnChooseFile').on('click', function () {
    // 触发文件选择框 input 的点击事件
    $('#file').click();
  });

  // 获取用户上传的图片并进行裁剪
  // 为文件选择框绑定change事件
  $('#file').on('change', function (e) {
    //获取上传的文件
    var files = e.target.files;
    if (files.length !== 0) {
      // 拿到用户选择的文件
      var file = e.target.files[0];
      // 将文件转化为路径
      var imgURL = URL.createObjectURL(file);
      // 重新初始化裁剪区域
      $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
    }
  });

  // 为确定框绑定点击事件
  $('#confirm').on('click', function (e) {
    var dataURL = $image
      .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
        width: 100,
        height: 100
      })
      .toDataURL('image/png') // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
      // 上传图片
      $.ajax({
        method: 'POST',
        url: '/my/update/avatar',
        data: {
          avatar: dataURL
        },
        success: function (res) {
            if(res.status!==0){
              return layer.msg('更新头像失败');
            }
            layer.msg('更新头像成功');
            // 调用获取用户信息更新头像
            window.parent.getUserInfo();
        }
      });
  });

});