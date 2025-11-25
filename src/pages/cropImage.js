// src/pages/cropImage.js
export const getCroppedImg = async (imageSrc, pixelCrop, rotation = 0, flip = { horizontal: false, vertical: false }) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";
    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("Contexto do canvas não disponível"));

        // Ajuste do canvas para evitar width/height 0
        canvas.width = pixelCrop.width || 1;
        canvas.height = pixelCrop.height || 1;

        ctx.save();

        // Flip
        ctx.translate(flip.horizontal ? canvas.width : 0, flip.vertical ? canvas.height : 0);
        ctx.scale(flip.horizontal ? -1 : 1, flip.vertical ? -1 : 1);

        // Rotação
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.translate(-canvas.width / 2, -canvas.height / 2);

        // Escala da imagem
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        ctx.drawImage(
          image,
          pixelCrop.x * scaleX,
          pixelCrop.y * scaleY,
          pixelCrop.width * scaleX,
          pixelCrop.height * scaleY,
          0,
          0,
          canvas.width,
          canvas.height
        );

        ctx.restore();

        // Retorna a URL do blob
        canvas.toBlob((blob) => {
          if (!blob) return reject(new Error("Canvas está vazio"));
          resolve(URL.createObjectURL(blob));
        }, "image/png");
      } catch (err) {
        reject(err);
      }
    };
    image.onerror = (err) => reject(new Error("Erro ao carregar a imagem"));
  });
};
