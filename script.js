document.addEventListener("DOMContentLoaded", function () {
    // QR Code
    const qr = new QRious({
        element: document.getElementById("qr-code"),
        value: "http://www.viewneo.com",
        level: "H",
        foreground: '#0068c9',
    });

    // Slideshow code
    const slideshowImages = ["img/1.png", "img/2.png", "img/3.png", "img/4.png", "img/5.png"];
    let currentImageIndex = 0;
    let isSlideshow1Visible = true;
    const slideshow1 = document.getElementById("slideshow1");
    const slideshow2 = document.getElementById("slideshow2");
    const indicators = document.querySelectorAll(".indicator");

    // Set the first image and activate Ken Burns animation immediately
    slideshow1.src = slideshowImages[0];
    slideshow1.style.opacity = 1;
    slideshow2.style.opacity = 0;

    const initialScale = 1.1 + Math.random() * 0.4;
    const initialX = (Math.random() - 0.5) * 40;
    const initialY = (Math.random() - 0.5) * 40;
    slideshow1.style.transform = `scale(${initialScale}) translate(${initialX}px, ${initialY}px)`;

    // Set the first indicator as active
    indicators[currentImageIndex].classList.add("active");

    function updateSlideshow() {
        currentImageIndex = (currentImageIndex + 1) % slideshowImages.length;
        const nextImage = slideshowImages[currentImageIndex];
        const activeImage = isSlideshow1Visible ? slideshow1 : slideshow2;
        const inactiveImage = isSlideshow1Visible ? slideshow2 : slideshow1;

        inactiveImage.src = nextImage;
        inactiveImage.style.opacity = 0;

        // New Ken Burns animation settings
        const randomScale = 1.1 + Math.random() * 0.4;
        const randomX = (Math.random() - 0.5) * 40;
        const randomY = (Math.random() - 0.5) * 40;
        inactiveImage.style.transform = `scale(${randomScale}) translate(${randomX}px, ${randomY}px)`;

        setTimeout(() => {
            inactiveImage.style.opacity = 1;
            activeImage.style.opacity = 0;
        }, 50);

        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle("active", index === currentImageIndex);
        });

        isSlideshow1Visible = !isSlideshow1Visible;
    }

    // Start the slideshow with a 10-second interval
    setInterval(updateSlideshow, 10000);

    // Dynamic line count calculation
    const contentMain = document.querySelector('.content-main');
    const computedStyle = getComputedStyle(contentMain);
    const lineHeight = parseFloat(computedStyle.lineHeight) || 24;
    const availableHeight = contentMain.clientHeight;

    // Calculate initial max line count based on adjusted height
    let initialMaxLines = Math.floor(availableHeight / lineHeight);

    // Count <p> tags that can fit within the initially calculated lines
    const paragraphs = Array.from(contentMain.querySelectorAll("p"));
    let visiblePCount = 0;
    let usedLines = 0;

    for (const p of paragraphs) {
        const pStyle = getComputedStyle(p);
        const marginBottom = parseFloat(pStyle.marginBottom) || 0;
        const pHeight = p.clientHeight || lineHeight;
        const totalHeight = pHeight + marginBottom;

        const linesForP = Math.ceil(totalHeight / lineHeight);

        if (usedLines + linesForP <= initialMaxLines) {
            visiblePCount++;
            usedLines += linesForP;
        } else {
            break;
        }
    }

    // Adjust final maxLines to account for visible paragraph tags
    let maxLines = initialMaxLines - visiblePCount;
    maxLines = Math.max(1, maxLines);

    // Set the -webkit-line-clamp property inline
    contentMain.style.display = '-webkit-box';
    contentMain.style.webkitBoxOrient = 'vertical';
    contentMain.style.webkitLineClamp = maxLines;
    contentMain.style.overflow = 'hidden';
});
