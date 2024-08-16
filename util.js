const scaleTo = (atual, real) => {
    let percent = atual / real;
    return (1 - percent) + 1;
}

const mustRotate = (pw,ph,fw,fh) => {
    return false;
    let cols = parseInt(pw/fw);
    let rows = parseInt(ph/fh);
    let actual = cols*rows;

    cols = parseInt(ph/fw);
    rows = parseInt(pw/fh);
    let other = cols*rows;
    return (actual > other) ? false : true; 
}

async function displayPDF(base64) {

    // Carrega o PDF a partir do base64
    pdfjsLib.getDocument(base64).promise.then(function(pdf) {
        // Carrega a primeira página do PDF
        for(var i = 1; i<= pdf.numPages; i++){
            pdf.getPage(i).then(function(page) {
                var canvas = document.createElement("canvas");
                var context = canvas.getContext("2d");
                var viewport = page.getViewport({ scale: 10 });
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                // Renderiza a página no canvas
                page.render({
                    canvasContext: context,
                    viewport: viewport
                });
                document.getElementById("wrapper").appendChild(canvas);
            });    
        }
        document.querySelector("#wrapper").style.display = "flex";
    }).catch(function(error) {
        console.error("Erro ao carregar o PDF:", error);
    });
}

async function splitPdf(docmentAsBytes, page) {
    // Load your PDFDocument
    console.info(page);
    const pdfDoc = await PDFLib.PDFDocument.load(docmentAsBytes);
    const numberOfPages = pdfDoc.getPages().length;
    if(numberOfPages == 1 && page > 0 ){ return null; }
    let origDims = pdfDoc.getPages();
    origDims = [origDims[0].getWidth(),(origDims[0].getHeight()/numberOfPages)];
    // Create a new "sub" document
    let subDocument = await PDFLib.PDFDocument.create();
    let [copiedPage] = await subDocument.copyPages(pdfDoc, [page]);
    subDocument.addPage(copiedPage, origDims);
    let pdfBytes = await subDocument.save();
    return pdfBytes;
}

export {mustRotate, scaleTo, splitPdf, displayPDF};