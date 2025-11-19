// imglab/js/storePersistor.js

/**
 * Kiểm tra xem có dữ liệu cũ trong bộ nhớ trình duyệt không
 * Nếu có thì hỏi người dùng có muốn khôi phục không
 */
function confirmUserToLoadBrowserCache() {
  var cachedStr = localStorage.getItem("labellingData");

  if (cachedStr) {
    try {
      var cachedData = JSON.parse(cachedStr);
      // Chỉ hỏi nếu dữ liệu cache có nội dung
      if (Object.keys(cachedData).length > 0) {
        $.confirm({
          title: "Restore Session",
          content:
            "Found unsaved data from previous session. Do you want to restore it?",
          buttons: {
            confirm: {
              text: "Yes, Restore",
              btnClass: "btn-blue",
              action: function () {
                labellingData = cachedData;
                if (typeof showSnackBar === "function") {
                  showSnackBar("Data restored successfully!");
                }
                // Nếu đang ở màn hình workarea, cần vẽ lại (reload page hoặc trigger event)
                // Nhưng thường hàm này chạy khi mới load trang nên biến labellingData cập nhật là đủ.
              },
            },
            cancel: {
              text: "No, Discard",
              action: function () {
                localStorage.removeItem("labellingData");
              },
            },
          },
        });
      }
    } catch (e) {
      console.error("Error parsing local storage data", e);
    }
  }
}

/**
 * Xóa cache thủ công
 */
function clearCache() {
  localStorage.removeItem("labellingData");
  if (typeof showSnackBar === "function") {
    showSnackBar("Browser cache cleared.");
  }
}

/**
 * Hàm thực hiện lưu dữ liệu vào LocalStorage
 */
var synchToBrowser = function () {
  // 1. Kiểm tra xem config có cho phép autosave không
  if (typeof appConfig !== "undefined" && appConfig.autosave.enable) {
    // 2. Kiểm tra xem có dữ liệu để lưu không
    if (
      typeof labellingData !== "undefined" &&
      Object.keys(labellingData).length > 0
    ) {
      try {
        localStorage.setItem("labellingData", JSON.stringify(labellingData));
      } catch (e) {
        console.warn("Auto-save failed (LocalStorage might be full):", e);
      }
    }
  }
};

// Khởi động bộ đếm thời gian để Auto-save
// Thời gian interval lấy từ settings.js
if (typeof appConfig !== "undefined" && appConfig.autosave) {
  window.setInterval(
    synchToBrowser,
    appConfig.autosave.syncingInterval || 10000
  );
}

// Đợi 1 giây sau khi load trang rồi mới kiểm tra cache để giao diện ổn định
setTimeout(confirmUserToLoadBrowserCache, 1000);
