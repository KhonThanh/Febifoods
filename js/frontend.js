// js phần component
document.addEventListener("DOMContentLoaded", () => {
  const includeElements = document.querySelectorAll("[data-include]");
  let loadedCount = 0;

  includeElements.forEach(async (el) => {
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
    } finally {
      loadedCount++;
      if (loadedCount === includeElements.length) {
        document.dispatchEvent(new Event("includesLoaded")); // 🔑 bắn sự kiện
      }
    }
  });
});


// js enviroment

$(document).ready(function () {
  if ($('.environment').length) {
    $('.environment').slick({
      slidesToShow: 4,
      slidesToScroll: 2,
      dots: false,
      arrows: false,
      infinite: true,
      autoplay: true,
      centerMode: true,
      centerPadding: '0',
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3
          }
        },
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 2
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 2
          }
        }
      ]
    });
  }
});

// js thêm width và height vào bất kì thẻ img
document.addEventListener("includesLoaded", () => {
  const images = document.querySelectorAll("img");

  images.forEach((img) => {
    if (!img.hasAttribute("loading")) {
      img.setAttribute("loading", "lazy");
    }
    if (img.complete) {
      setDimensions(img);
    } else {
      img.addEventListener("load", () => setDimensions(img));
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

// js slide product
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver(() => {
    const items = document.querySelectorAll(".all-product__item");
    if (items.length > 0) {
      initProductSlider();
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

// Hàm scale
function initProductSlider() {
  const items = document.querySelectorAll(".all-product__item");
  if (items.length === 0) return;

  const total = items.length;
  const isEven = total % 2 === 0;
  const centerIndex = isEven ? total / 2 - 0.5 : Math.floor(total / 2);

  items.forEach((item, index) => {
    let distance = Math.abs(index - centerIndex);
    let scale;

    if (isEven) {
      if (index === centerIndex || index === centerIndex + 1) {
        scale = 1;
        item.classList.add("center");
      } else {
        scale = 1 - 0.1 * distance;
      }
    } else {
      if (index === centerIndex) {
        scale = 1;
        item.classList.add("center");
      } else {
        scale = 1 - 0.1 * distance;
      }
    }

    if (scale < 0.5) scale = 0.5;
    item.style.transform = `scale(${scale})`;
    item.style.zIndex = Math.floor(100 - distance);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll("section, footer");
  if (!sections.length) return;

  sections.forEach(sec => sec.classList.add("hidden-section"));

  let revealIndex = 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        el.style.transitionDelay = `${revealIndex * 50}ms`;
        revealIndex++;

        el.classList.add("show-up");

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0,
    rootMargin: "0px 0px -20% 0px"
  });

  sections.forEach(sec => observer.observe(sec));
});

// js trang liên hệ
document.addEventListener('DOMContentLoaded', function () {
  const items = document.querySelectorAll('.contact-item');

  if (items[0]) items[0].classList.add('border-bottom');
  if (items[1]) items[1].classList.add('border-bottom', 'bottom-icon-SP');

  for (let i = 2; i < items.length; i += 3) {
    if (i + 3 < items.length) {
      for (let j = i; j < i + 3 && j < items.length; j++) {
        items[j].classList.add('border-bottom');
      }
    }
  }
  for (let i = 3; i < items.length; i += 3) {
    items[i].classList.add('border-icon', 'border-left-right');
  }
});

// js product
$(document).ready(function () {
  if ($('.all-product__container').length) {
    $('.all-product__container').slick({
      slidesToShow: 1,  
      slidesToScroll: 1,
      infinite: false,
      arrows: false,
      dots: false,
    });
  }
});


document.addEventListener("click", function (e) {
  // Xử lý cho .community-list ul li
  if (e.target.closest(".community-list ul li")) {
    const clickedItem = e.target.closest("li");
    const parent = clickedItem.closest("ul");
    parent.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    clickedItem.classList.add("active");
  }

  // Xử lý cho .list-time a
  if (e.target.closest(".list-time a")) {
    const clickedLink = e.target.closest("a");
    const parent = clickedLink.closest(".list-time");
    parent.querySelectorAll("a").forEach(a => a.classList.remove("active"));
    clickedLink.classList.add("active");
  }
});

$("[data-include]").load("file.html", function () {
  const $slider = $(".all-product__image--mobile");

  if ($slider.length && !$slider.hasClass("slick-initialized")) {
    $slider.slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: true,
      arrows: true,
      dots: false,
      responsive: [
        {
          breakpoint: 551,
          settings: {
            slidesToShow: 1
          }
        }
      ]
    });
  }
});


// list sản phẩm mobile
document.addEventListener("DOMContentLoaded", () => {
  const slider = document.querySelector(".all-product__image-mobile");

  if (slider && typeof jQuery !== "undefined" && typeof jQuery(slider).slick === "function") {
    jQuery(slider).slick({
      slidesToShow: 5,
      slidesToScroll: 1,
      arrows: false,
      Infinity:true,
      autoplay:400,
      centerMode: true,
      dots: false,
      responsive: [
        {
          breakpoint: 768,
          settings: {
            slidesToShow: 3
          }
        }
      ]
    });
  }
});

// js menu mobile
document.addEventListener("includesLoaded", () => {
    console.log("✅ Tất cả component đã load xong!");

    // 👉 Viết JS khác ở đây (ví dụ: menu toggle)
    const menuToggle = document.querySelector('#menumobile .menu__btn img[alt=""]');
    const menuContent = document.querySelector('#menumobile .menu-mobile__content');

    if (menuToggle && menuContent) {
        menuToggle.addEventListener('click', () => {
            menuContent.classList.toggle('active');
        });
    }
});