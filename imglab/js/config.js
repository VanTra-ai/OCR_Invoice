var tools = {
  labelling: {
    "tool-rectangle": {
      type: "rect",
      title: "Rectangle",
      desp: "Create a Boundary box",
      icon: "rectangle.svg",
      drawable: true,
      create: function (e, container) {
        var rect = container.nested().rect().addClass("labelbox shape");
        rect.resize();
        rect.parent().draggable();
        return rect;
      },
      validate: function (el) {
        return Number.parseInt(el.attr("width")) > 3;
      },
    },
  },
  canvas: {
    "tool-move": {
      title: "Move",
      desp: "Move an element or the entire workarea",
      icon: "move.svg",
      type: "move",
    },
    "tool-zoom": {
      title: "Zoom",
      desp: "Enlarge the workarea",
      icon_font: "icon-zoom-in",
      actions: ["zoom"],
    },
  },
};

var imgSelected = "";
var selectedElements = [];
var copiedElements;
var selectedTool = tools.labelling["tool-rectangle"];
var selectedElement = null;
var alreadyDrawing = false;
var eventBus;
var plugins = {};
var pluginsStore = {};

// Danh sách nhãn gợi ý
var suggestedCategories = [
  "ItemName",
  "ItemNameValue",
  "Quantity",
  "QuantityValue",
  "UnitPrice",
  "UnitPriceValue",
  "Amount",
  "AmountValue",
  "Other",
];

// --- ĐỊNH NGHĨA BẢNG MÀU (COLOR CODING) ---
var labelColors = {
  ItemName: "rgb(139, 0, 0)", // Đỏ thẫm
  ItemNameValue: "rgb(255, 69, 0)", // Cam đỏ
  Quantity: "rgb(0, 100, 0)", // Xanh lá đậm
  QuantityValue: "rgb(50, 205, 50)", // Xanh lá mạ
  UnitPrice: "rgb(0, 0, 139)", // Xanh dương đậm
  UnitPriceValue: "rgb(30, 144, 255)", // Xanh dương nhạt
  Amount: "rgb(75, 0, 130)", // Tím chàm
  AmountValue: "rgb(255, 0, 255)", // Tím hồng
  Other: "rgb(192, 192, 192)", // Xám
};
