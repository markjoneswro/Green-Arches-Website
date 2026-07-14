const galleryTrack = document.getElementById('heroGalleryTrack');

if (galleryTrack) {
  const galleryImages = [
    'assets/images/20241025_162149.jpg',
    'assets/images/20241025_162206.jpg',
    'assets/images/20241025_205549.jpg',
    'assets/images/20241025_210704.jpg',
    'assets/images/20241025_210943.jpg',
    'assets/images/20241025_215948.jpg',
    'assets/images/20241025_221407.jpg',
    'assets/images/20241025_221440.jpg',
    'assets/images/20241025_221534.jpg',
    'assets/images/20241026_101105.jpg',
    'assets/images/20241026_102958.jpg',
    'assets/images/20241026_110943.jpg',
    'assets/images/20241026_111015.jpg',
    'assets/images/20241026_111103.jpg',
    'assets/images/20241026_111141.jpg',
    'assets/images/20241026_111255.jpg',
    'assets/images/20241026_111335.jpg',
    'assets/images/20241026_111418.jpg',
    'assets/images/20241026_111447.jpg',
    'assets/images/20241026_111507.jpg',
    'assets/images/20241026_111521.jpg',
    'assets/images/20241026_111646.jpg',
    'assets/images/20241026_111654.jpg',
    'assets/images/20241026_111702.jpg',
    'assets/images/20241026_111714.jpg',
    'assets/images/20241026_111729.jpg',
    'assets/images/20250423_180451.jpg',
    'assets/images/20250423_180516.jpg',
    'assets/images/20250423_180527.jpg',
    'assets/images/20250423_180623.jpg',
    'assets/images/20250423_181113.jpg',
    'assets/images/20250423_181120.jpg',
    'assets/images/20250423_181128.jpg',
    'assets/images/20250423_181142.jpg',
    'assets/images/20250423_181201.jpg',
    'assets/images/20250423_181249.jpg',
    'assets/images/20250423_181306.jpg',
    'assets/images/20250423_183918.jpg',
    'assets/images/20250423_211210.jpg',
    'assets/images/20250423_211218.jpg',
    'assets/images/20250423_211242.jpg',
    'assets/images/20250423_212650.jpg',
    'assets/images/20250423_212659.jpg',
    'assets/images/Bathroom.jpg',
    'assets/images/Bedroom 1.jpg',
    'assets/images/Bedroom 2.jpg',
    'assets/images/Corridor.jpg',
    'assets/images/Linving room.jpg',
    'assets/images/Outside.jpg'
  ];

  const images = [];
  galleryImages.forEach((src) => {
    const image = document.createElement('img');
    image.src = src;
    image.alt = '';
    image.loading = 'lazy';
    galleryTrack.appendChild(image);
    images.push(image);
  });

  const leftButton = document.querySelector('.gallery-nav-left');
  const rightButton = document.querySelector('.gallery-nav-right');
  const gap = 32;
  let activeIndex = 0;
  let isDragging = false;
  let startX = 0;
  let currentOffset = 0;

  const mainBodyCopy = document.querySelector('.main-body-copy');
  const imageStack = document.querySelector('.image-stack');

  const alignImageStack = () => {
    if (!mainBodyCopy || !imageStack) return;
    if (window.matchMedia('(max-width: 768px)').matches) {
      imageStack.style.marginTop = '0px';
      return;
    }
    const grid = imageStack.closest('.content-grid');
    if (!grid) return;
    const gridTop = grid.getBoundingClientRect().top;
    const bodyTop = mainBodyCopy.getBoundingClientRect().top;
    const offset = Math.max(0, bodyTop - gridTop);
    imageStack.style.marginTop = `${offset}px`;
  };

  const clampIndex = (index) => Math.max(0, Math.min(index, images.length - 1));

  const getOffsetBefore = (index) => {
    let offset = 0;
    for (let i = 0; i < index; i += 1) {
      offset += images[i].getBoundingClientRect().width + gap;
    }
    return offset;
  };

  const getCenterOffset = (index) => {
    const viewport = galleryTrack.parentElement?.clientWidth || window.innerWidth;
    const image = images[index];
    if (!image) return 0;
    const activeWidth = image.getBoundingClientRect().width;
    const offsetBefore = getOffsetBefore(index);
    return viewport / 2 - (offsetBefore + activeWidth / 2);
  };

  const applyTransform = (translateX) => {
    galleryTrack.style.transform = `translate3d(${translateX}px, 0, 0)`;
  };

  const setActiveIndex = (index) => {
    activeIndex = clampIndex(index);
    currentOffset = getCenterOffset(activeIndex);
    applyTransform(currentOffset);
    images.forEach((image, imageIndex) => image.classList.toggle('active', imageIndex === activeIndex));
  };

  leftButton?.addEventListener('click', () => setActiveIndex(activeIndex - 1));
  rightButton?.addEventListener('click', () => setActiveIndex(activeIndex + 1));

  galleryTrack.addEventListener('pointerdown', (event) => {
    isDragging = true;
    startX = event.clientX;
    galleryTrack.setPointerCapture(event.pointerId);
    galleryTrack.style.cursor = 'grabbing';
    event.preventDefault();
  });

  galleryTrack.addEventListener('pointermove', (event) => {
    if (!isDragging) return;
    const delta = event.clientX - startX;
    applyTransform(currentOffset + delta);
  });

  const finishDrag = (clientX) => {
    if (!isDragging) return;
    isDragging = false;
    galleryTrack.style.cursor = 'grab';
    const delta = clientX - startX;
    const threshold = Math.max(110, window.innerWidth * 0.12);
    if (delta < -threshold) {
      setActiveIndex(activeIndex + 1);
    } else if (delta > threshold) {
      setActiveIndex(activeIndex - 1);
    } else {
      setActiveIndex(activeIndex);
    }
  };

  galleryTrack.addEventListener('pointerup', (event) => finishDrag(event.clientX));
  galleryTrack.addEventListener('pointercancel', () => {
    isDragging = false;
    galleryTrack.style.cursor = 'grab';
    setActiveIndex(activeIndex);
  });

  const refreshGallery = () => setActiveIndex(activeIndex);
  images.forEach((image) => image.addEventListener('load', refreshGallery));
  window.addEventListener('load', () => {
    refreshGallery();
    alignImageStack();
  });
  window.addEventListener('resize', () => {
    refreshGallery();
    alignImageStack();
  });
  requestAnimationFrame(() => {
    setActiveIndex(0);
    alignImageStack();
  });
}
