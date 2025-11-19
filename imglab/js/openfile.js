// imglab/js/openfile.js
function openDataFile() {
  $.dialog({
    title: "Open / Import Project",
    content: `<p>Load a previously saved project file (.nimn, .json, .xml).</p>
                <div style="text-align:center;">
                    <label class="btn btn-primary btn-bs-file">Browse File
                        <input id="browse" type="file" class="filebutton" accept=".nimn,.xml,.json" />
                    </label>
                </div>`,
    escapeKey: true,
    backgroundDismiss: true,
    onContentReady: function () {
      $("#browse").bind("change", function (input) {
        readDataFile(input);
      });
    },
  });
}

function readDataFile(e) {
  var input = e.target || e.srcElement;
  if (input.files && input.files[0]) {
    var dataFile = input.files[0];
    var reader = new FileReader();

    reader.onload = function (e) {
      var content = e.target.result;

      if (dataFile.name.endsWith(".json")) {
        loadJSONFile(content);
      } else if (dataFile.name.endsWith(".nimn")) {
        loadProjectFile(content);
      } else if (dataFile.name.endsWith(".xml")) {
        loadDlibXml(content);
      } else {
        showSnackBar("File format not supported!");
        console.log("Not supported format");
      }
    };

    reader.readAsText(input.files[0]);
  }
  input.value = null;
}

var loadJSONFile = function (data) {
  try {
    var parsedData = JSON.parse(data);
    // Kiểm tra xem đây là định dạng COCO hay Internal Format
    if (parsedData.images && parsedData.annotations) {
      // Nếu là COCO
      if (typeof cocoFormater !== "undefined") {
        labellingData = cocoFormater.fromCOCO(parsedData);
      }
    } else {
      // Nếu là định dạng nội bộ (Internal) - Quan trọng cho OCR
      // Gán trực tiếp dữ liệu để giữ nguyên các trường attributes (Text OCR)
      labellingData = parsedData;
    }
    showSnackBar("Project loaded successfully!");
  } catch (err) {
    console.error(err);
    showSnackBar("Error loading JSON file.");
  }
};

var loadProjectFile = function (data) {
  try {
    // NIMN là định dạng nén của imglab, dùng schema đã định nghĩa
    labellingData = nimn.parse(nimnSchema, data);
    showSnackBar("Project loaded successfully!");
  } catch (err) {
    console.error(err);
    showSnackBar("Error loading NIMN file.");
  }
};

var loadDlibXml = function (data) {
  try {
    var obj = parser.parse(data, {
      ignoreAttributes: false,
      attributeNamePrefix: "",
    });

    var image = obj.dataset.images.image;
    if (!Array.isArray(image)) {
      image = [image];
    }

    for (var index = 0; index < image.length; index++) {
      var pathArr = image[index].file.split(/\\|\//);
      var imgName = pathArr[pathArr.length - 1];
      var boxes = image[index].box;
      var boxObject = [];

      if (boxes) {
        if (!Array.isArray(boxes)) {
          boxes = [boxes];
        }
        for (var b_index = 0; b_index < boxes.length; b_index++) {
          var currentBox = boxes[b_index];

          boxObject.push({
            id: "rect" + b_index,
            label: currentBox.label || "",
            type: "rect",
            bbox: {
              x: parseInt(currentBox.left),
              y: parseInt(currentBox.top),
              h: parseInt(currentBox.height),
              w: parseInt(currentBox.width),
            },
            points: [
              parseInt(currentBox.left),
              parseInt(currentBox.top),
              parseInt(currentBox.width),
              parseInt(currentBox.height),
            ],
            attributes: [], // Reset attributes khi load từ XML
            tags: [],
          });
        }
      }

      // Nếu ảnh đã có trong store thì mới gán (hoặc tạo mới nếu cần)
      // Ở đây ta gán trực tiếp vào labellingData
      if (!labellingData[imgName]) {
        // Tạo placeholder nếu chưa có
        labellingData[imgName] = { shapes: [] };
      }
      labellingData[imgName].shapes = boxObject;
    }
    showSnackBar("XML loaded. Note: XML may not contain OCR text.");
  } catch (e) {
    console.error(e);
    showSnackBar("Error parsing XML.");
  }
};
