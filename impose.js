import {mustRotate, scaleTo, splitPdf, displayPDF} from "./util.js";

const impose = async (docmentAsBytes)=>{
    let selected = document.getElementById("papel").value;
    const pg_w = parseFloat(document.querySelector(`option[value="${selected}"]`).getAttribute("largura"));//328;
    const pg_h = parseFloat(document.querySelector(`option[value="${selected}"]`).getAttribute("altura"));//478;
    const bleed = parseFloat(document.getElementById("sangria").value);
    let pd_w = parseFloat(document.getElementById("largura").value);
    let pd_h = parseFloat(document.getElementById("altura").value);
    pd_w = (pd_w) + (2 * bleed);
    pd_h = (pd_h) + (2 * bleed);

      let page1 = await splitPdf(docmentAsBytes, 0);
      let page2 = await splitPdf(docmentAsBytes, 1);

      let pdfBytes = [page1];
      if(page2 !== null){ pdfBytes.push(page2); }
      let pdfDoc = await PDFLib.PDFDocument.create();

      for (let p = 0; p < pdfBytes.length; p++) {
        // Create a new "sub" document
        let [origFile] = await pdfDoc.embedPdf(pdfBytes[p]);
        let origFileDims = [pd_w, pd_h];
        //let helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Add a blank page to the document
        let page = undefined; 
        if(mustRotate(pg_w, pg_h, pd_w, pd_h)){
          console.log("rotated...");
          page = pdfDoc.addPage([pg_h, pg_w]);
        }else{
          page = pdfDoc.addPage([pg_w, pg_h]);
        }
        let cols = parseInt(pg_w / pd_w);
        let rows = parseInt(pg_h / pd_h);
        let page_h = page.getHeight();
        let page_w = page.getWidth();
        let mg_w = (pg_w - (cols * pd_w)) / 2;
        let mg_h = (pg_h - (rows * pd_h)) / 2 ;
        
        for(let i = 0; i < rows; i++){
          for(let j = 0; j < cols; j++){
            let x = mg_w + j*pd_w;
            let y = mg_h + i*pd_h;
            page.drawPage(origFile, {
              width: pd_w,
              height: pd_h,
              x: x,
              y: y
            });
          }
        }
        for(let i = 0; i < rows; i++){
          for(let j = 0; j < cols; j++){
            let x = mg_w + j*pd_w;
            let y = mg_h + i*pd_h;
            if(i == 0){//quando a linha é a zero, preenche as colunas
              page.moveTo(x + bleed , y + bleed);
              page.drawSvgPath('V 0,10', {borderWidth:0.3});
              page.moveTo(x + pd_w - bleed , y + bleed);
              page.drawSvgPath('V 0,10', {borderWidth:0.3});
              if(j == cols-1){
                page.drawSvgPath('H 10,0', {borderWidth:0.3});
              }
            }
            if(i == rows-1){//quando a linha é a zero, preenche as colunas
              page.moveTo(x + bleed , y + pd_h - bleed);
              page.drawSvgPath('V 0,-10', {borderWidth:0.3});
              page.moveTo(x + pd_w - bleed , y + pd_h - bleed);
              page.drawSvgPath('V 0,-10', {borderWidth:0.3});
              if(j == cols-1){
                page.drawSvgPath('H 10,0', {borderWidth:0.3});
              }
            }
            if(j == 0){//quando a linha é a zero, preenche as colunas
              page.moveTo(x + bleed , y + bleed);
              page.drawSvgPath('H -10,0', {borderWidth:0.3});
              page.moveTo(x + bleed, y + pd_h - bleed);
              page.drawSvgPath('H -10,0', {borderWidth:0.3});
              if(i == rows-1){
                page.drawSvgPath('V 0,-10', {borderWidth:0.3});
              }
            }
            if(j == cols-1){//quando a linha é a zero, preenche as colunas
              page.moveTo(x + pd_w - bleed , y + bleed);
              page.drawSvgPath('H 0,10', {borderWidth:0.3});
              page.moveTo(x + pd_w - bleed , y + pd_h - bleed);
              page.drawSvgPath('H 0,10', {borderWidth:0.3});
            }
          }
        }

    } //fim do for de páginas

    // Serialize the PDFDocument to bytes (a Uint8Array)
    let arquivo_final = await pdfDoc.save();

    var blob = new Blob([arquivo_final], {type: 'application/pdf' });
    let reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
        let base64String = reader.result;
        displayPDF(base64String);
        document.querySelector("#baixar").setAttribute("href", base64String);
        document.querySelector("#baixar").removeAttribute("disabled");
        document.querySelector("#baixar").classList.remove("disabled");
    } 
};

export default impose