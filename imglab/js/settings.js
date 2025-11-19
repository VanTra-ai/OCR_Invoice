// imglab/js/settings.js

var appConfig = {
  autosave: {
    syncingInterval: 10 * 1000, // 10 seconds
    enable: true,
    deleteIfExported: true, // Xóa cache sau khi export để tránh đầy bộ nhớ
  },
  zoomStepSize: 0.1, // Bước nhảy khi zoom (10%)
};

function displaySettingsModal() {
  $.dialog({
    title:
      '<i class="icon-wrench" style="color: #138496; font-size: 1.2em;"></i> Settings',
    content: "<settings-window></settings-window>",
    escapeKey: true,
    backgroundDismiss: true,
    useBootstrap: false,
    boxWidth: 450, // Chỉnh lại độ rộng cho vừa vặn hơn
    onContentReady: function () {
      riot.mount("settings-window");
    },
  });
}
