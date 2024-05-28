let prev = document.querySelector('.prev')
let prevSvg = document.querySelector('.prev svg')
let next = document.querySelector('.next')
let nextSvg = document.querySelector('.next svg')
let track = document.querySelector('.secs-cont')

const buttons = document.querySelectorAll('.third-btns button')
const thirdSections = document.querySelectorAll('.third-section')
const tsBtns = document.querySelectorAll('.back-svg')

const plusses = document.querySelectorAll('.plus')
const accContentP = document.querySelectorAll('.acc-content p')
const accContents = document.querySelectorAll('.acc-content')

let trans = 0;
let currSlide = 0;
let clickedFirst = false;

/* handling prev button click */
prev.addEventListener('click', e=>{

    if(currSlide === 0){
        currSlide = 0;
        return;
    }

    trans += 100;
    currSlide--;
    track.style.transform = `translateX(${trans}%)`

    
    prev.style.width = '4.5vw';
    prev.style.height = '4.5vw';
    
    prevSvg.style.width = '2.5vw'
    prevSvg.style.height = '2.5vw'

    setTimeout(() =>{
        prev.style.width = '5vw';
        prev.style.height = '5vw';
        prevSvg.style.width = '3vw'
        prevSvg.style.height = ''
    },50)

    showArrs()
    
})

/* prev button animation on click */
prev.addEventListener('mousedown', e=>{
    
    prev.style.width = '4.5vw';
    prev.style.height = '4.5vw';
    
    prevSvg.style.width = '2.5vw'
    prevSvg.style.height = '2.5vw'

    showArrs()
    
})

/* next button animation on click */
next.addEventListener('mousedown', e=>{
    
    next.style.width = '4.5vw';
    next.style.height = '4.5vw';
    
    nextSvg.style.width = '2.5vw'
    nextSvg.style.height = '2.5vw'

    showArrs()
    
})

/* handling next button click */
next.addEventListener('click', e=>{

    if(currSlide == 5){
        currSlide = 5;
        return;    
    }

    trans -= 100;
    currSlide++;

    track.style.transform = `translateX(${trans}%)`
    clickedFirst = true;

    next.style.width = '4.5vw';
    next.style.height = '4.5vw';

    nextSvg.style.width = '2.5vw'
    nextSvg.style.height = '2.5vw'

    setTimeout(() =>{
        next.style.width = '5vw';
        next.style.height = '5vw';
        nextSvg.style.width = '52px'
        nextSvg.style.height = '52px'
    },50)

    showArrs()
    
})


function prevHover(){
    prev.style.opacity = '1'
}

function prevUnHover(){
    prev.style.opacity = '0.2'
}


// initial settings / functions

setTimeout(() =>{
    if(clickedFirst === false)
    next.style.opacity = '1'
},6000)

function showArrs(){

    if(currSlide === 0){
        next.style.opacity = '1'
        prev.style.opacity = '0'

        prev.removeEventListener('mouseover', prevHover)
        prev.removeEventListener('mouseout', prevUnHover)
    }
    else if(currSlide === 3){
        prev.style.opacity = '0.2'
        next.style.opacity = '1'

        prev.addEventListener('mouseover', prevHover)
        prev.addEventListener('mouseout', prevUnHover)
    }
    else if(currSlide === 4){
        prev.style.opacity = '0.2'
        next.style.opacity = '1'

        prev.addEventListener('mouseover', prevHover)
        prev.addEventListener('mouseout', prevUnHover)
    }
    else if(currSlide === 5){
        prev.style.opacity = '1'
        next.style.opacity = '0'

        prev.removeEventListener('mouseover', prevHover)
        prev.removeEventListener('mouseout', prevUnHover)
    }
    else{
        prev.style.opacity = '1'
        next.style.opacity = '1'

        prev.removeEventListener('mouseover', prevHover)
        prev.removeEventListener('mouseout', prevUnHover)
    }
}

/* handling third section button clicks */

buttons.forEach(btn =>{

    btn.addEventListener('click', e =>{

        thirdSections.forEach(sec =>{

            if(sec.dataset.name == btn.dataset.name){
                sec.style.top = '0%'
                sec.style.background = "#1a1b1f"
                prev.style.opacity = '0'
                prev.style.pointerEvents = 'none'
                next.style.opacity = '0'
                next.style.pointerEvents = 'none'
            }
        })
    })
})


/* back svgs */
tsBtns.forEach(btn =>{
    btn.addEventListener('click', e =>{

        let path;

        if(e.target.dataset.type === "svg"){

            path = e.target.parentElement.parentElement;

        }
        else if(e.target.dataset.type === "path"){

            path =  e.target.parentElement.parentElement.parentElement;
            
        }

        path.style.top = '100%';
        path.style.background = 'rgba(26,27,31,0.65)';

        prev.style.opacity = '1'
        prev.style.pointerEvents = 'all'
        next.style.opacity = '1'
        next.style.pointerEvents = 'all'

        btn.style.width = '40px'
        btn.style.height = '40px'

        setTimeout(() =>{
            btn.style.width = '65px'
            btn.style.height = '65px'
        },250)
        
    })
})


/* Accordions */

plusses.forEach(plus =>{

    plus.addEventListener('click', e =>{

        let content = plus.parentElement.nextElementSibling;
        let id = plus.dataset.id;
        
        /* closing */
        if(content.classList.contains('acc-active')){
            content.style.maxHeight = '0px'
            content.classList.remove('acc-active')
            plus.childNodes[1].style.opacity = '1'

            setTimeout(() =>{
                content.childNodes[1].style.opacity = '0'
            },200)

            return
        }

        /* opening */
        content.style.maxHeight = '200px'
        content.childNodes[1].childNodes[1].style.opacity = '1' // p
        content.classList.add('acc-active')
        plus.childNodes[1].style.opacity = '0'
        
        accContents.forEach(cont =>{ // dla kazdego acc-content
            if(cont.parentElement.childNodes[1].childNodes[3].dataset.id != id){ // jezeli plus nie zawiera obecnego id to schowaj
                cont.style.maxHeight = '0px'
                cont.childNodes[1].style.opacity = '0'
                cont.previousElementSibling.childNodes[3].childNodes[1].style.opacity = '1'
            }
            else{
                cont.style.maxHeight = '200px'
                cont.childNodes[1].style.opacity = '1'
            }
        })

    })
})