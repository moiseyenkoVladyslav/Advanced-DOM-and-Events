'use strict';

///////////////////////////////////////
// Modal window

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const nav = document.querySelector(`.nav`);
const btnScrollTo = document.querySelector(`.btn--scroll-to`);
const section1 = document.querySelector(`#section--1`);
///////////////Page Navigation///////////////

//Bad Solution - not oficient
// document.querySelectorAll(`.nav__link`).forEach(function (el) {
//   el.addEventListener(`click`, function (e) {
//     e.preventDefault();

//     const id = this.getAttribute(`href`);
//     console.log(id);

//     document.querySelector(id).scrollIntoView({ behavior: `smooth` });
//   });
// });

//1. Add event listener to common parent element.
//2. Determinate what element originated the event

document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  e.preventDefault();

  //Mathcing strategy
  if (e.target.classList.contains(`nav__link`)) {
    const id = e.target.getAttribute(`href`); // now is the element what needed not `this` but e.target
    console.log(id);

    document.querySelector(id).scrollIntoView({ behavior: `smooth` });
  }
});

////////Tabbed Component
const tabs = document.querySelectorAll(`.operations__tab`);
const tabsContainer = document.querySelector(`.operations__tab-container`);
const tabsContent = document.querySelectorAll(`.operations__content`);

//tabs.forEach(t => t.addEventListener(`click`, () => console.log(`TAB`))); - BAD PRACTICE for big amount of element

tabsContainer.addEventListener(`click`, function (e) {
  const clicked = e.target.closest(`.operations__tab`);

  //Guard clause
  if (!clicked) return;

  //Activate Tab + remove activ classes
  tabs.forEach(t => t.classList.remove(`operations__tab--active`));
  clicked.classList.add(`operations__tab--active`);

  //Activate content area + remove activ classes
  tabsContent.forEach(c => c.classList.remove(`operations__content--active`));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add(`operations__content--active`);
});

///////////Slider

const slider = function () {
  const slides = document.querySelectorAll(`.slide`);
  const btnLeft = document.querySelector(`.slider__btn--left`);
  const btnRight = document.querySelector(`.slider__btn--right`);
  let curSlide = 0;
  const maxSlide = slides.length - 1;

  const dotContainer = document.querySelector(`.dots`);

  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        `beforeend`,
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(`.dots__dot`)
      .forEach(dot => dot.classList.remove(`dots__dot--active`)); //diactivate active class firstly
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add(`dots__dot--active`);
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // const slider = document.querySelector(`.slider`);
  // slider.style.transform = `scale(0.4) translateX(-1600px)`;
  // slider.style.overflow = `visible`;

  // 0%,100%,200%,300%
  //Next Slide
  const nextSlide = function () {
    if (curSlide === maxSlide) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide;
    } else {
      curSlide--;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };
  //Function Stuck
  const init = function () {
    createDots();
    activateDot(0);
    goToSlide(0);
  };
  init();

  //Event Handlers
  btnRight.addEventListener(`click`, nextSlide);
  btnLeft.addEventListener(`click`, prevSlide);

  document.addEventListener(`keydown`, function (e) {
    //  console.log(e);
    if (e.key === `ArrowLeft`) prevSlide();
    e.key === `ArrowRight` && nextSlide(); // short surcuting!
  });
  document.addEventListener(`click`, function (e) {
    if (e.target.classList.contains(`dots__dot`)) {
      // console.log(e.target.dataset,`DatasetObject`);
      const { slide } = e.target.dataset; // Object destructuring
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();
///////////

///////Lazy Loading Image
const imgTargets = document.querySelectorAll(`img[data-src]`);
console.log(imgTargets);

const loadImg = function (entries, observer) {
  const [entry] = entries;
  console.log(entry);

  if (!entry.isIntersecting) return;

  //Replace src with data-src
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener(`load`, function () {
    entry.target.classList.remove(`lazy-img`);
  });

  observer.unobserve(entry.target);
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: `+200px`,
});

imgTargets.forEach(img => imgObserver.observe(img));
///////

///////Menu fade animation
const handleHover = function (e) {
  if (e.target.classList.contains(`nav__link`)) {
    const link = e.target;
    const siblings = link.closest(`.nav`).querySelectorAll(`.nav__link`);
    const logo = link.closest(`.nav`).querySelector(`img`);

    siblings.forEach(el => {
      if (el !== link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

nav.addEventListener(`mouseover`, handleHover.bind(0.5));
nav.addEventListener(`mouseout`, handleHover.bind(1));
///////

/////////////Sticky navigation
/*
const initialCords = section1.getBoundingClientRect();
console.log(initialCords);

window.addEventListener(`scroll`, function (e) {
  // console.log(window.scrollY);

  if (window.scrollY >= initialCords) {
    nav.classList.add(`sticky`);
  } else nav.classList.remove(`dsticky`);
});
*/
//////

/////////////Sticky navigation: Intersection Observer API
/*
const obsCallback = function (entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
  });
};
const obsOptions = {
  root: null,
  threshold: [0, 0.2],
};
const observer = new IntersectionObserver(obsCallback, obsOptions);
observer.observe(section1);
*/
const header = document.querySelector(`.header`);
const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);

  if (!entry.isIntersecting) nav.classList.add(`sticky`);
  else nav.classList.remove(`sticky`);
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0.1,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(header);
//////

//////////Menu

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener(`click`, openModal));

// for (let i = 0; i < btnsOpenModal.length; i++)
//   btnsOpenModal[i].addEventListener('click', openModal);

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});
/////////////////////////////////
/////////////////////////////////
/////////////////////////////////

//Selecting Elements
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

const allSection = document.querySelectorAll(`.section`);
console.log(allSection);

document.getElementById(`section--1`);
const allButtons = document.getElementsByTagName(`button`);
console.log(allButtons);

document.getElementsByClassName(`btn`);

//Creating and inserting Elements
//.insertAdjacentHTML

const message = document.createElement(`div`);
message.classList.add(`cookie-message`);
// message.textContent = `We used coockies for improved functioanlity and analytics.`;
message.innerHTML = `We used coockies for improved functioanlity and analytics. <button class="btn btn--close-cookie">Got it!</button>`;
// header.prepend(message);
header.append(message);
// header.append(message.cloneNode(true));

// header.after(message);

////////////////////////
//Delete Elements
////////////////////////
document
  .querySelector(`.btn--close-cookie`)
  .addEventListener(`click`, function () {
    message.remove();
  });

// Styles

//easy way to set a properety on object
// message.style.backgroundColor = `#373`;
// message.style.width = `120%`;

console.log(message.style.color);
console.log(message.style.backgroundColor);
console.log(getComputedStyle(message).height);

message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + `px`;
// document.documentElement.style.setProperty(`--color-primary`, `orangered`);
/*
//Attributes
const logo = document.querySelector(`.nav__logo`);
console.log(logo.alt);

console.log(logo.className);

logo.alt = `Beatiful minimalist logo`;

//non-defined attr.
console.log(logo.designer);
console.log(logo.getAttribute(`designer`));
console.log(logo.setAttribute(`company`, `Bankist`));

console.log(logo.src);
console.log(logo.getAttribute(`src`));

const link = document.querySelector(`.nav__link--btn`);
console.log(link.href);
console.log(link.getAttribute(`href`));

//Data attributes
console.log(logo.dataset.versionNumber);

//Classes
logo.classList.add(`c`, `j`);
logo.classList.remove(`c`);
logo.classList.toggle(`c`);
logo.classList.contains(`c`);

//bad practice, cs overwrite!! and just 1 class name
logo.className = `jonas`;
*/
////////////////Smooth Scrolling////////////////

btnScrollTo.addEventListener(`click`, function (e) {
  // const s1coords = section1.getBoundingClientRect();

  // console.log(s1coords);
  // console.log(e.target.getBoundingClientRect());
  // console.log(`Current Scroll (x/y)`, window.scrollX, window.scrollY);
  // console.log(
  //   `height/width viewport`,
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );

  // //Scrolling
  // // window.scrollTo(
  // //   s1coords.left + window.scrollX,
  // //   s1coords.top + window.scrollY
  // // );
  // window.scrollTo({
  //   left: s1coords.left + window.scrollX,
  //   top: s1coords.top + window.scrollY,
  //   behavior: `smooth`,
  // });
  section1.scrollIntoView({ behavior: `smooth` });
});

const alertH1 = function (e) {
  alert(`addEventListner: Great! You are reading the heading :D`);
  // h1.removeEventListener(`mouseenter`, alertH1);
};
const h1 = document.querySelector(`h1`);
h1.addEventListener(`mouseenter`, alertH1);

setTimeout(() => h1.removeEventListener(`mouseenter`, alertH1), 1000);
// h1.onmouseenter = function (e) {
//   alert(`addEventListner: Great! You are reading the heading :D`);
// };

/*
/////////////////////Bubling
// rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;
console.log(randomColor(0, 255));

document.querySelector(`.nav__link`).addEventListener(`click`, function (e) {
  this.style.backgroundColor = randomColor(0, 255);
  console.log(`link`, e.target, e.currentTarget);

  // Stopping the event propagation
  //e.stopPropagation();
});
document.querySelector(`.nav__links`).addEventListener(`click`, function (e) {
  this.style.backgroundColor = randomColor(0, 255);
  console.log(`Container`, e.target, e.currentTarget);
});
document.querySelector(`.nav`).addEventListener(`click`, function (e) {
  this.style.backgroundColor = randomColor(0, 255);
  console.log(`Nav`, e.target, e.currentTarget);
});

//document.querySelector(`.nav`).addEventListener(`click`, function (e) {}, true); - Listnening to Events while CAPTURING PHASE !


*/

/*
////////////////DOM Traversing////////////////

// Going downwards : child

console.log(h1.querySelectorAll(`.highlight`));
console.log(h1.childNodes);
console.log(h1.children);
h1.firstElementChild.style.color = `white`;
h1.lastElementChild.style.color = `orangered`;

//Going upwards: selecting Parents
console.log(h1.parentNode);
console.log(h1.parentElement);

h1.closest(`.header`).style.background = `var(--gradient-secondary)`;

// Going sideways: Siblings

console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

console.log(h1.previousSibling);
console.log(h1.nextSibling);

console.log(h1.parentElement.children);

[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) el.style.transform = `scale(0.5)`;
});

*/
// console.log(`here is section 1 `, section1);

// Lifecycle - From the Page is load, until User leave the page .
//DOMContentLoaded  fires when HTML + JS are loaded. (No Photos or other content)
//document.ready(Jquerry) is same as DOMContentLoaded(JS). When puttin script-file on the end of HTML, no need to listen to

document.addEventListener(`DOMContentLoaded`, function (e) {
  console.log(`HTML parsed and DOM tree built`, e);
});

//load - Event. When all resources are loaded (NOT ONLY Html and Css)
window.addEventListener(`load`, function (e) {
  console.log(`Page fully loaded`, e);
});

//PopUp window before Leaving
window.addEventListener(`beforeunload`, function () {
  e.preventDefault();
  console.log(e);
  e.returnValue = ``;
});
