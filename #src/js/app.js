// LAZY LOADING
@@include("yall.min.js");
document.addEventListener("DOMContentLoaded", yall);

// FIXED HEADER
window.addEventListener('scroll', () => {
  const header = document.querySelector('header')
  header.classList.toggle('sticky', window.scrollY > 0)
})

// SCROLL ACTIVE LINK
const sections = document.querySelectorAll('section[id]')

function scrollActive(){
    const scrollY = window.pageYOffset

    sections.forEach(current =>{
        const sectionHeight = current.offsetHeight
        const sectionTop = current.offsetTop - 50;
        sectionId = current.getAttribute('id')

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight){
            document.querySelector('.nav a[href*=' + sectionId + ']').classList.add('active')
        } else {
            document.querySelector('.nav a[href*=' + sectionId + ']').classList.remove('active')
        }
    })
}
window.addEventListener('scroll', scrollActive)

// BURGER MENU
function toggleMenu () {
  const burger = document.querySelector('.burger')
  const nav = document.querySelector('.nav')
  const body = document.querySelector('body')

  burger.classList.toggle('show')
  nav.classList.toggle('show')
  body.classList.toggle('lock')
}

// GLIDER
@@include("glider.min.js");

window.addEventListener('load', function(){
  new Glider(document.querySelector('.reviews__list'), {
    slidesToShow: 1,
    slidesToScroll: 1,
    duration: 0.1,
    arrows: {
      prev: '.glider-prev',
      next: '.glider-next'
    },
    dots: '.dots',
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          duration: 0.1,
          arrows: {
            prev: '.glider-prev',
            next: '.glider-next'
          },
          dots: '.dots',
          itemWidth: 360
        }
      }
    ]
  })

  new Glider(document.querySelector('.services__list'), {
    slidesToShow: 1,
    slidesToScroll: 1,
    duration: 0.1,
    arrows: {
      prev: '.services-prev',
      next: '.services-next'
    },
    itemWidth: 360,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          duration: 0.1,
          arrows: {
            prev: '.services-prev',
            next: '.services-next'
          },
          itemWidth: 360
        }
      }, {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          duration: 0.1,
          arrows: {
            prev: '.services-prev',
            next: '.services-next'
          },
          itemWidth: 360
        }
      }, {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          duration: 0.1,
          arrows: {
            prev: '.services-prev',
            next: '.services-next'
          },
          itemWidth: 360
        }
      }
    ]
  })
})