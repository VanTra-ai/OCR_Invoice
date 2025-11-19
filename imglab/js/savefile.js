// imglab/js/savefile.js

/**
 * Hiển thị hộp thoại chọn định dạng lưu
 */
function selectFileTypeToSave() {
  $.dialog({
    title: "Export Data",
    content: `<div style="text-align:center; padding: 10px;">
                <p>Select export format:</p>
                <div class="d-grid gap-2">
                    <button class="btn btn-primary btn-block mb-3" onclick="javascript:saveAsCOCO()" style="padding: 10px;">
                        <b style="font-size: 1.2em">COCO JSON</b><br>
                    </button>
                </div>
            <div>`,
    escapeKey: true,
    backgroundDismiss: true,
  });
}

/**
 * LƯU DẠNG COCO JSON (QUAN TRỌNG NHẤT)
 * Hàm này gọi cocoFormater.toCOCO() mà chúng ta vừa sửa ở bước trước
 */
function saveAsCOCO() {
  // Gọi hàm chuyển đổi dữ liệu sang cấu trúc chuẩn
  var cocoData = cocoFormater.toCOCO(labellingData);

  // Tạo tên file
  var count = Object.keys(labellingData).length;
  var fileName = "export_coco_" + count + "_images.json";

  askFileName(fileName, function (name) {
    if (!name.toLowerCase().endsWith(".json")) name += ".json";

    // Chuyển đổi object thành chuỗi JSON và tải xuống
    var dataStr = JSON.stringify(cocoData, null, 4);
    download(dataStr, name, "application/json");
  });
}

/**
 * Lưu dự án dạng NIMN (Backup nội bộ của imglab)
 */
function saveAsNimn() {
  askFileName("project_backup.nimn", function (fileName) {
    if (!fileName.toLowerCase().endsWith(".nimn")) fileName += ".nimn";
    download(
      nimn.stringify(nimnSchema, labellingData),
      fileName,
      "application/nimn"
    );
  });
}

// --- CÁC HÀM TIỆN ÍCH ---

function download(data, filename, type, encoding) {
  encoding || (encoding = "utf-8");
  var blobData = new Blob([data], { type: type + ";charset=" + encoding });
  saveAs(blobData, filename);
}

function askFileName(suggestedName, cb) {
  $.confirm({
    title: "File Name",
    content: `<input class="form-control" type="text" id="fileName" value="${suggestedName}" >`,
    buttons: {
      confirm: {
        text: "Download",
        btnClass: "btn-blue",
        action: function () {
          var fname = this.$content.find("#fileName").val();
          if (!fname) {
            $.alert("Please provide a valid name");
            return false;
          }
          cb(fname);
        },
      },
      cancel: function () {},
    },
  });
}

function analytics_reportExportType(type, len) {
  try {
    if (typeof gtag === "function") {
      gtag("event", "save_as", {
        event_category: type,
        value: 1,
      });
    }
  } catch (e) {}
}
