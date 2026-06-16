"use client";

import { useEffect, useState } from "react";

export default function EventsModalHandler() {
  const [modalData, setModalData] = useState({
    title: "",
    desc: "",
    images: [] as string[]
  });

  useEffect(() => {
    const handleGalleryClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const btn = target.closest(".highlight-btn") as HTMLElement | null;
      
      if (btn && btn.dataset.bsToggle === "modal") {
        const title = btn.dataset.title || "";
        const desc = btn.dataset.desc || "";
        const imgUrl = btn.dataset.img || "";
        const galleryRaw = btn.dataset.gallery;
        
        let images: string[] = [];
        try {
          if (galleryRaw) {
            images = JSON.parse(galleryRaw);
          }
        } catch (err) {}

        // Fallback to single image if gallery is empty
        if (images.length === 0 && imgUrl) {
          images = [imgUrl];
        }

        setModalData({ title, desc, images });
      }
    };

    document.addEventListener("click", handleGalleryClick);
    return () => {
      document.removeEventListener("click", handleGalleryClick);
    };
  }, []);

  return (
    <div className="modal fade" id="galleryModal" tabIndex={-1} aria-labelledby="galleryModalLabel" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content border-0 bg-dark text-white" style={{ borderRadius: "20px", overflow: "hidden" }}>
          <div className="modal-header border-0 pb-0">
            <h5 className="modal-title fw-bold text-white" id="galleryModalLabel">{modalData.title || "Event Highlights"}</h5>
            <button type="button" className="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body p-4 text-center">
            
            {modalData.images.length > 1 ? (
              <div id="eventGalleryCarousel" className="carousel slide mb-3" data-bs-ride="carousel">
                <div className="carousel-inner rounded" style={{ maxHeight: "480px" }}>
                  {modalData.images.map((img, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                      <img src={img} className="d-block w-100 object-fit-contain" style={{ maxHeight: "480px" }} alt="Highlight" />
                    </div>
                  ))}
                </div>
                <button className="carousel-control-prev" type="button" data-bs-target="#eventGalleryCarousel" data-bs-slide="prev">
                  <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button" data-bs-target="#eventGalleryCarousel" data-bs-slide="next">
                  <span className="carousel-control-next-icon" aria-hidden="true"></span>
                  <span className="visually-hidden">Next</span>
                </button>
              </div>
            ) : modalData.images.length === 1 && modalData.images[0] ? (
              <img src={modalData.images[0]} className="img-fluid rounded mb-3 object-fit-contain mx-auto" style={{ maxHeight: "480px", width: "100%" }} alt="Event Image" />
            ) : null}

            <p className="text-white-50 m-0 fs-6">{modalData.desc}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
