// js phần component
const includeElements = document.querySelectorAll("[data-include]");
let loadedCount = 0;

Promise.all(
  [...includeElements].map(async (el) => {
    const file = el.getAttribute("data-include");
    if (!file) return;

    const cacheKey = `comp-${file}`;
    let html = sessionStorage.getItem(cacheKey);

    if (!html) {
      const response = await fetch(`${file}?v=${Date.now()}`, { cache: "no-store" });
      html = await response.text();
      sessionStorage.setItem(cacheKey, html);
    }

    el.innerHTML = html;
    if (typeof initResponsive === "function") initResponsive(el);

    loadedCount++;
    if (loadedCount === includeElements.length) {
      document.dispatchEvent(new Event("includesLoaded"));
    }
  })
);

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
function applyLazyAndDimensions(img) {
  if (!img.hasAttribute("loading")) {
    img.setAttribute("loading", "lazy");
  }

  const updateSize = () => {
    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
      setDimensions(img);
      return true;
    }
    return false;
  };

  if (updateSize()) return; // có kích thước rồi thì thôi

  img.addEventListener("load", () => updateSize());

  // Nếu trong tab ẩn, đợi nó hiển thị rồi mới set
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        updateSize();
        observer.disconnect();
      }
    });
  });
  observer.observe(img);
}

function setDimensions(img) {
  if (!img.hasAttribute("width")) {
    img.setAttribute("width", img.naturalWidth);
  }
  if (!img.hasAttribute("height")) {
    img.setAttribute("height", img.naturalHeight);
  }
}

// Chạy khi includesLoaded
document.addEventListener("includesLoaded", () => {
  document.querySelectorAll("img").forEach(applyLazyAndDimensions);
});

// Chạy lại mỗi khi Slick init hoặc reInit
$(document).on('init reInit afterChange', '.slick-slider', function () {
  $(this).find('img').each(function () {
    applyLazyAndDimensions(this);
  });
});

// js slide
if (!$('.homepageslide').length) {
  console.warn('⚠️ .homepageslide not found');
} else if (!$('.dot-slide').length) {
  console.warn('⚠️ .dot-slide not found');
} else {
  $('.homepageslide').slick({
    infinite: true, // lưu ý "Infinite" => "infinite"
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
  const tabButtons = Array.from(document.querySelectorAll('.story-tab'));
  const tabContents = Array.from(document.querySelectorAll('.tab-content'));
  const sliderSelector = '.story-tab_container';
  const $slider = $(sliderSelector);

  if (!tabButtons.length || !tabContents.length) return;

  // helper: set active/tab content theo index (không click để tránh vòng lặp)
  function setActiveByIndex(idx) {
    tabButtons.forEach(b => b.classList.remove('active'));
    tabContents.forEach(c => c.classList.remove('show'));
    if (tabButtons[idx]) tabButtons[idx].classList.add('active');
    if (tabContents[idx]) tabContents[idx].classList.add('show');
  }

  // mặc định active = 0 (sẽ được override nếu slider init ở mobile)
  setActiveByIndex(0);

  // click trên tab (desktop hoặc mobile)
  tabButtons.forEach((btn, index) => {
    btn.addEventListener('click', function () {
      if (this.classList.contains('active')) return;

      // nếu slider mobile đang active -> điều hướng slick (afterChange sẽ sync active)
      if (window.innerWidth <= 551 && $slider.hasClass('slick-initialized')) {
        $slider.slick('slickGoTo', index);
      } else {
        // desktop: set trực tiếp
        setActiveByIndex(index);
      }
    });
  });

  // Khởi tạo / destroy slick tuỳ kích thước
  function initStoryTabsSlider() {
    if (window.innerWidth <= 551) {
      if (!$slider.hasClass('slick-initialized')) {
        // Gắn sự kiện init trước khi gọi slick
        $slider.on('init.storyTabs', function (event, slick) {
          // sau init lấy center slide để sync active
          const $center = $slider.find('.slick-slide.slick-center').first();
          const dataIdx = $center.attr('data-slick-index');
          const idx = dataIdx !== undefined ? parseInt(dataIdx, 10) : 0;
          const total = tabButtons.length;
          const normalized = ((idx % total) + total) % total;
          setActiveByIndex(normalized);
        });

        // afterChange: tìm slide center rồi sync active/tab content
        $slider.on('afterChange.storyTabs', function (event, slick, currentSlide) {
          const $center = $slider.find('.slick-slide.slick-center').first();
          const dataIdx = $center.attr('data-slick-index');
          const idx = dataIdx !== undefined ? parseInt(dataIdx, 10) : currentSlide;
          const total = tabButtons.length;
          const normalized = ((idx % total) + total) % total;
          setActiveByIndex(normalized);
        });

        // call slick
        $slider.slick({
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: true,
          infinite: true,
          centerMode: true,
          centerPadding: '0px',
          prevArrow: '<button class="slick-prev custom-arrow" aria-label="Previous"><</button>',
          nextArrow: '<button class="slick-next custom-arrow" aria-label="Next">></button>',
        });
      }
    } else {
      if ($slider.hasClass('slick-initialized')) {
        $slider.slick('unslick');
        // hủy event namespace nếu muốn (an toàn)
        $slider.off('.storyTabs');
        // reset active về tab 0 hoặc giữ tab hiện tại tuỳ bạn
        setActiveByIndex(0);
      }
    }
  }

  // chạy lần đầu và khi resize (debounce)
  initStoryTabsSlider();
  let _t;
  window.addEventListener('resize', function () {
    clearTimeout(_t);
    _t = setTimeout(initStoryTabsSlider, 120);
  });
});

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

  sections.forEach(sec => {
    // Đảm bảo ẩn tất cả section và footer, dù nằm trong div nào
    sec.classList.add("hidden-section");
  });

  let revealIndex = 0;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;

        el.style.transitionDelay = `${revealIndex * 20}ms`;
        revealIndex++;

        el.classList.add("show-up");

        observer.unobserve(el);
      }
    });
  }, {
    threshold: 0.08,              // chỉ cần xuất hiện 10% là hiện
    rootMargin: "0px 0px -10% 0px"
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

//js product
document.addEventListener("DOMContentLoaded", function () {
  let $slider = $('.all-type__content');

  function initSlick() {
    if (window.innerWidth <= 1024) {
      if (!$slider.hasClass('slick-initialized')) {
        $slider.slick({
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          centerMode: true,
          arrows: true,
          dots: false,
          prevArrow: '<button class="slick-prev custom-arrow" aria-label="Previous"><</button>',
          nextArrow: '<button class="slick-next custom-arrow" aria-label="Next">></button>',
          responsive: [
            {
              breakpoint: 586,
              settings: {
                slidesToShow: 1
              }
            }
          ]
        });
      }
    } else {
      if ($slider.hasClass('slick-initialized')) {
        $slider.slick('unslick');
      }
    }
  }

  initSlick();
  window.addEventListener('resize', initSlick);
});


document.addEventListener("click", function (e) {
  // Xử lý cho .community-list ul li
  if (e.target.closest(".community-list ul li")) {
    const clickedItem = e.target.closest("li");
    const parent = clickedItem.closest("ul");
    parent.querySelectorAll("li").forEach(li => li.classList.remove("active"));
    clickedItem.classList.add("active");
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
      Infinity: true,
      autoplay: 400,
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
document.addEventListener("DOMContentLoaded", () => {
  const btnMenu = document.getElementById("btn-menu");
  const menuContent = document.querySelector(".menu-mobile__content");
  const menuBackground = document.querySelector(".background-mobile");
  const btnClose = document.querySelector(".btn-close button");

  if (btnMenu && menuContent && menuBackground && btnClose) {
    // Mở menu
    btnMenu.addEventListener("click", () => {
      menuContent.classList.add("active");
      menuBackground.classList.add("active");
    });

    // Đóng menu khi click nền đen
    menuBackground.addEventListener("click", () => {
      menuContent.classList.remove("active");
      menuBackground.classList.remove("active");
    });

    // Đóng menu khi click nút close
    btnClose.addEventListener("click", () => {
      menuContent.classList.remove("active");
      menuBackground.classList.remove("active");
    });
  }
});

// js phần tắt mở popup đăng ký
document.addEventListener("DOMContentLoaded", () => {
  const btnRec = document.getElementById("recruitmentReg");
  const popupRecContainer = document.querySelector(".recruitment-popup");
  const btnClose = document.getElementById("close-btn");
  const popupContainer = document.querySelector(".recruitment-form__container");

  if (!btnRec || !popupRecContainer || !btnClose || !popupContainer) return;

  btnRec.addEventListener("click", () => {
    popupRecContainer.classList.add("active");
  });

  btnClose.addEventListener("click", () => {
    popupRecContainer.classList.remove("active");
  });

  popupRecContainer.addEventListener("click", (e) => {
    if (!popupContainer.contains(e.target)) {
      popupRecContainer.classList.remove("active");
    }
  });


});

// js nội dung bài viết
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.querySelector('.btn-readmore');
  const excerpt = document.querySelector('.post-excerpt');
  const btnIcon = btn ? btn.querySelector('img') : null;

  if (!btn || !excerpt || !btnIcon) return;

  btn.addEventListener('click', function () {
    const isExpanded = excerpt.classList.toggle('expanded');

    btn.textContent = isExpanded ? 'THU GỌN' : 'XEM THÊM';

    // 🛠 Giữ lại icon khi đổi text
    btn.appendChild(btnIcon);

    // 🔄 Đổi icon
    btnIcon.src = isExpanded
      ? './img/icon/down-rev.png'
      : './img/icon/down.png';
  });
});

// js nôi dung bài viét
document.addEventListener('DOMContentLoaded', function () {
  const postContent = document.querySelector('.post-content');
  const tocList = document.querySelector('.toc-list');

  if (!postContent || !tocList) return;

  const headings = postContent.querySelectorAll('h2, h3, h4, h5, h6');
  if (headings.length === 0) return;

  tocList.innerHTML = '';

  headings.forEach((heading) => {
    const text = heading.textContent.trim();
    const id = text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^[0-9]+\.\s*/, "")
      .toLowerCase();

    heading.id = id;

    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = `#${id}`;
    a.textContent = text;

    li.appendChild(a);
    tocList.appendChild(li);
  });

  tocList.addEventListener('click', function (e) {
    const clickedLi = e.target.closest('li');
    if (!clickedLi) return;

    const lis = tocList.querySelectorAll('li');
    lis.forEach(li => li.classList.remove('active'));
    clickedLi.classList.add('active');
  });
});

// js nạp alt cho hình trong bài viết
const postContent = document.querySelector('.post-content');

if (postContent) {
  postContent.querySelectorAll('img').forEach(img => {
    if (img.alt.trim() !== '') {   // chỉ tạo caption nếu có alt
      const caption = document.createElement('span');
      caption.textContent = img.alt;
      caption.className = 'img-caption';
      img.insertAdjacentElement('afterend', caption);
    }
  });
}

// js đổi hình icon social 
document.addEventListener('mouseover', (e) => {
  if (e.target.matches('.footer-ecom a img, .footer-social a img')) {
    const img = e.target;
    if (!img.dataset.original) {
      img.dataset.original = img.src; // Lưu src gốc
    }
    img.src = img.src.replace('.png', '-hover.png');
  }
});

document.addEventListener('mouseout', (e) => {
  if (e.target.matches('.footer-ecom a img, .footer-social a img')) {
    const img = e.target;
    if (img.dataset.original) {
      img.src = img.dataset.original; // Trả lại src gốc
    }
  }
});

//js xác định và gấn class active cho menu 
document.addEventListener("DOMContentLoaded", () => {
  let currentPath = window.location.pathname.split("/").pop() || "index.html";

  // 🔥 Bỏ hậu tố chi tiết để nhận diện menu cha
  const childSuffixes = ["-detail", "-info", "-view"];
  childSuffixes.forEach(suffix => {
    if (currentPath.includes(suffix)) {
      currentPath = currentPath.replace(suffix, "");
    }
  });

  // ====== Desktop Menu ======
  const desktopHeader = document.querySelector(".header-bottom");
  if (desktopHeader) {
    const menuLinks = desktopHeader.querySelectorAll("a[href]");
    if (menuLinks.length) {
      menuLinks.forEach(link => link.classList.remove("nav-active"));
      menuLinks.forEach(link => {
        const linkPath = link.getAttribute("href").replace("./", "");
        if (linkPath === currentPath) {
          link.classList.add("nav-active");
        }
      });
    }
  }

  // ====== Mobile Menu ======
  const mobileMenu = document.querySelector("#menumobile");
  if (mobileMenu) {
    const mobileLinks = mobileMenu.querySelectorAll(".menu-mobile__item[href]");
    if (mobileLinks.length) {
      mobileLinks.forEach(link => link.classList.remove("mb-nav-active"));
      mobileLinks.forEach(link => {
        const linkPath = link.getAttribute("href").replace("./", "");
        if (linkPath === currentPath) {
          link.classList.add("mb-nav-active");
        }
      });
    }
  }
});

//js sản phẩm 
document.addEventListener("DOMContentLoaded", function () {
  if (window.innerWidth < 1300) {
    const menuLinks = document.querySelectorAll(".product-menu p");
    const productMenu = document.querySelector(".product-menu__content");

    if (menuLinks.length && productMenu) {
      menuLinks.forEach((link) => {
        link.addEventListener("click", function (e) {
          e.preventDefault();

          const isActive = link.classList.contains("active");

          // Xóa active cũ
          menuLinks.forEach(p => p.classList.remove("active"));
          productMenu.classList.remove("active");

          // Nếu chưa active thì thêm
          if (!isActive) {
            link.classList.add("active");
            productMenu.classList.add("active");
          }
        });
      });

      // Click ra ngoài -> remove active
      document.addEventListener("click", function (e) {
        const clickedInsideMenu = e.target.closest(".product-menu") || e.target.closest(".product-menu__content");

        if (!clickedInsideMenu) {
          menuLinks.forEach(p => p.classList.remove("active"));
          productMenu.classList.remove("active");
        }
      });
    }
  }
});

//js scroll to top

document.addEventListener("DOMContentLoaded", function () {
  const scrollBtn = document.getElementById("scrollToTop");

  if (scrollBtn) { // ✅ Chỉ chạy khi tồn tại nút
    window.addEventListener("scroll", function () {
      if (window.scrollY > 300) {
        scrollBtn.classList.add("show");
      } else {
        scrollBtn.classList.remove("show");
      }
    });

    scrollBtn.addEventListener("click", function () {
      const currentScroll = window.scrollY;

      if (currentScroll > 50) {
        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

        // Force về 0 sau animation (an toàn)
        setTimeout(() => {
          if (window.scrollY !== 0) window.scrollTo(0, 0);
        }, 600);
      }
    });
  }
});

// js menu
document.addEventListener('DOMContentLoaded', function () {
  const headerBottom = document.querySelector('.header-bottom');

  if (headerBottom) {
    window.addEventListener('scroll', function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (scrollTop >= 100) {
        headerBottom.classList.add('header-bottom__stick');
      } else {
        headerBottom.classList.remove('header-bottom__stick');
      }
    });
  }
});


// js khi bám ảnh sản phẩm
document.addEventListener('DOMContentLoaded', function () {
  const mainImage = document.querySelector('.detail-product__image img');
  const thumbnails = document.querySelectorAll('.thumbnail-images img');

  function checkElement(element, name) {
    if (!element || (element.length !== undefined && element.length === 0)) {
      console.error(`❌ Không tìm thấy phần tử: ${name}`);
      return false;
    }
    return true;
  }

  if (!checkElement(mainImage, 'Ảnh chính (.detail-product__image img)')) return;
  if (!checkElement(thumbnails, 'Ảnh thumbnail (.thumbnail-images img)')) return;

  thumbnails.forEach(thumb => {
    thumb.addEventListener('click', function () {
      mainImage.src = this.src;
    });
  });
});

// js cho certification
document.addEventListener("DOMContentLoaded", function () {
  const container = document.querySelector(".all-certification");
  if (!container) return;

  let items = container.querySelectorAll(".certification-item");
  if (items.length === 0) return;

  // Clone cho đủ 5 item
  // while (items.length < 5) {
  //   const clone = items[items.length % items.length === 0 ? 0 : items.length % items.length].cloneNode(true);
  //   container.appendChild(clone);
  //   items = container.querySelectorAll(".certification-item");
  // }

  function setPositions(mainIndex) {
    items.forEach((item, i) => {
      item.classList.remove("main", "left", "right");
      if (i === mainIndex) {
        item.classList.add("main");
      } else if (i < mainIndex) {
        item.classList.add("left");
      } else {
        item.classList.add("right");
      }
    });
  }

  function initDesktop() {
    setPositions(2);
    items.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {
        setPositions(index);
      });
    });
  }

  function initMobile() {
    $(container).slick({
      centerMode: true,
      slidesToShow: 3,
      infinite: true,
      arrows: false,
      dots: false,
      autoplay: 300,
    });
  }

  if (window.innerWidth > 768) {
    initDesktop();
  } else {
    initMobile();
  }

  // Nếu resize qua lại thì reload
  window.addEventListener("resize", () => {
    location.reload();
  });
});

//js cho phần brand

$(document).ready(function () {
  var $wrap = $('.brand-content');
  if (!$wrap.length) return;
  var $items = $wrap.children('.brand-content__item');
  if (!$items.length) return;
  if (!$wrap.children('.brand-content__item').length) return;
  if ($wrap.hasClass('slick-initialized')) {
    $wrap.slick('unslick');
  }

  $wrap.slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    infinite: true,
    // autoplay: true,
    // autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: '400px',
    dots: true,
    appendDots: $('.brand-slide__dot'),
    prevArrow: $('.brand-prev'),
    nextArrow: $('.brand-next'),
    responsive: [
      {
        breakpoint: 1165,
        settings: {
          centerPadding: '100px'
        }
      },
      {
        breakpoint: 769,
        settings: {
          centerPadding: '60px'
        }
      },

      {
        breakpoint: 551,
        settings: {
          centerPadding: '0px'
        }
      },
    ]
  });
});

// js marketing
const btns = document.querySelectorAll('#asia, #africa, #northAmerica, #oceania');

btns.forEach(btn => {
  btn.addEventListener('click', function () {
    const list = this.querySelector('.nation-list');
    if (!list) return;

    const isOpen = list.classList.contains('open');

    // Đóng tất cả
    document.querySelectorAll('.nation-list').forEach(l => {
      l.style.height = '0px';
      l.classList.remove('open');
    });

    // Nếu đang mở thì đóng luôn
    if (isOpen) return;

    // Mở cái mới
    list.classList.add('open');
    list.style.height = list.scrollHeight + 'px';
  });
});

// js pagination
const paginationLinks = document.querySelectorAll('.pagination-content a');
paginationLinks.forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    this.classList.add('active');
  });
});

// js filter
window.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".custom-select .selected").forEach(selectedEl => {
    selectedEl.addEventListener("click", function () {
      const optionsEl = this.parentElement.querySelector(".options");
      optionsEl.classList.toggle("active");
    });
  });

  document.querySelectorAll(".custom-select .option-container div").forEach(optionEl => {
    optionEl.addEventListener("click", function () {
      const value = this.getAttribute("data-value");
      const customSelect = this.closest(".custom-select");
      const selectedText = customSelect.querySelector(".selected p");

      selectedText.textContent = value;
      customSelect.querySelector(".options").classList.remove("active");
    });
  });
});

// js land
window.addEventListener("DOMContentLoaded", function () {
    // Bấm vào .selected_land để mở/đóng .options_land
    document.querySelectorAll(".selected_land").forEach(selectedEl => {
        selectedEl.addEventListener("click", function () {
            const optionsEl = this.querySelector(".options_land");
            optionsEl.classList.toggle("active");
        });
    });
});
// js thông tin quan hệ cổ đông
document.addEventListener("click", function (e) {
  const listTime = document.querySelector(".list-time");
  const items = Array.from(listTime.querySelectorAll("a"));
  const activeIndex = items.findIndex(a => a.classList.contains("active"));

  // Nút trái
  if (e.target.closest(".list-time button:first-child")) {
    const newIndex = (activeIndex - 1 + items.length) % items.length;
    items.forEach(a => a.classList.remove("active"));
    items[newIndex].classList.add("active");
  }

  // Nút phải
  if (e.target.closest(".list-time button:last-child")) {
    const newIndex = (activeIndex + 1) % items.length;
    items.forEach(a => a.classList.remove("active"));
    items[newIndex].classList.add("active");
  }
});