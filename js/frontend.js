// js phần component
document.addEventListener("DOMContentLoaded", () => {
  const includeElements = document.querySelectorAll("[data-include]");

  includeElements.forEach(async el => {
    const file = el.getAttribute("data-include");
    if (!file) return;

    try {
      const response = await fetch(`${file}?v=${Date.now()}`, { cache: "no-store" });
      if (!response.ok) throw new Error(`Không tìm thấy file: ${file}`);

      const text = await response.text();
      el.innerHTML = text;

      if (typeof initResponsive === "function") {
        initResponsive(el);
      }

    } catch (err) {
      el.innerHTML = `
        <div style="color: red; padding: 1rem; background: #fff0f0; border: 1px solid red;">
          ⚠ Không tải được component: <strong>${file}</strong>
        </div>
      `;
      console.error("Lỗi khi fetch:", file, err);
    }
  });
});

// js thêm width và height vào bất kì thẻ img
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
    if (img.complete) {
      setDimensions(img);
    } else {
      img.addEventListener("load", function () {
        setDimensions(img);
      });
    }
  });

  function setDimensions(img) {
    if (!img.hasAttribute("width")) {
      img.setAttribute("width", img.naturalWidth);
    }
    if (!img.hasAttribute("height")) {
      img.setAttribute("height", img.naturalHeight);
    }
  }
});

// js slide
if (!$('.homepageslide').length) {
  console.error('❌ .homepageslide not found');
} else if (!$('.dot-slide').length) {
  console.error('❌ .dot-slide not found');
} else {
  $('.homepageslide').slick({
    Infinite: true,
    dots: true,
    appendDots: $('.dot-slide'),
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  });
  console.log('✅ Slick initialized successfully!');
}

// js type rice

$(document).ready(function () {
  if ($('.rice-slider').length) {
    $('.rice-slider').slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      autoplay: false,
      prevArrow: $('.rice-prev'),
      nextArrow: $('.rice-next'),
      responsive: [
        {
          breakpoint: 551,
          settings: {
            slidesToShow: 4
          }
        }
      ]
    });

    $('.rice-slider').on('click', 'a.rice-item', function (e) {
      e.preventDefault();
      $('.rice-item').removeClass('active');
      $(this).addClass('active');
    });

  } else {
    console.warn("Không tìm thấy .rice-slider");
  }
});

// js connect
$(document).ready(function () {
  $('.connection-content__item').on('click', function (e) {
    e.preventDefault(); 
    $('.connection-content__item').removeClass('active');
    $(this).addClass('active');
  });
});

//js story
document.addEventListener('DOMContentLoaded', function () {
  const tabButtons = document.querySelectorAll('.story-tab');
  const tabContents = document.querySelectorAll('.tab-content');

  // Kiểm tra nếu có ít nhất một tab và một content
  if (tabButtons.length && tabContents.length) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', function () {
        if (this.classList.contains('active')) return;

        // Reset active và show
        tabButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        tabContents.forEach(c => c.classList.remove('show'));

        const targetId = this.dataset.target;
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.classList.add('show');
        }
      });
    });
  }
});

// js map

function toggleBg() {
  const section = document.getElementById('mapSection');
  const title = document.getElementById('map-marketing__title');

  if (section.classList.contains('bg-white')) {
    section.classList.remove('bg-white');
    section.classList.add('bg-green');
    title.classList.add('title-color');
  } else {
    section.classList.remove('bg-green');
    section.classList.add('bg-white');
    title.classList.remove('title-color');
  }
}
