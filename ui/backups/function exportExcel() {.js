function exportExcel() {
  const flatData = lrBills.value.map((bill) => {
    const productsArr = Array.isArray(bill.products) ? bill.products : [];
    return {
      "LR Number": bill.lr_number || "",
      Date: bill.date || "",
      "From Customer": bill.from_customer_name || "",
      "From Place": bill.from_customer_place || "",
      "From Mobile": bill.from_customer_mobile || "",
      "From GSTIN": bill.from_customer_gst || "",
      "To Customer": bill.to_customer_name || "",
      "To Place": bill.to_customer_place || "",
      "To Mobile": bill.to_customer_mobile || "",
      "To GSTIN": bill.to_customer_gst || "",
      "Lorry Name": bill.lorry_name || "",
      "Lorry Number": bill.lorry_number || "",
      "Driver Name": bill.driver_name || "",
      "Driver Number": bill.driver_number || "",
      "Payment Status": bill.payment_status || "",
      Products: productsArr
        .map(
          (p, idx) =>
            `${idx + 1}) ${p.product_type || ""} - ${
              p.description || ""
            } (Qty: ${p.quantity || 0}, Amt: ${p.amount || 0}, Disc: ${
              p.discount || 0
            })`
        )
        .join("\n"),
      "Subtotal Amount": bill.subtotal_amount || 0,
      "SGST Amount": bill.sgst_amount || 0,
      "CGST Amount": bill.cgst_amount || 0,
      "Total Amount": bill.total_amount || 0,
      "Terms and Conditions": termsConditions.value || "",
    };
  });
  const ws = XLSX.utils.json_to_sheet(flatData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "LR Bills");
  XLSX.writeFile(wb, "LR_Bills_Detailed.xlsx");
}
function exportPDF() {
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text("LR Bills Detailed Report", 14, 15);
  lrBills.value.forEach((bill, index) => {
    const productsArr = Array.isArray(bill.products) ? bill.products : [];
    let startY = index === 0 ? 25 : doc.lastAutoTable.finalY + 20;
    if (startY > 250) {
      doc.addPage();
      startY = 20;
    }
    doc.setFontSize(12);
    doc.text(`LR Number: ${bill.lr_number || ""}`, 14, startY);
    doc.text(`Date: ${bill.date || ""}`, 150, startY);
    startY += 6;
    doc.text(
      `From: ${bill.from_customer_name || ""} (${
        bill.from_customer_place || ""
      }), Mob: ${bill.from_customer_mobile || ""}`,
      14,
      startY
    );
    startY += 6;
    doc.text(`From GSTIN: ${bill.from_customer_gst || "-"}`, 14, startY);
    startY += 6;
    doc.text(
      `To: ${bill.to_customer_name || ""} (${
        bill.to_customer_place || ""
      }), Mob: ${bill.to_customer_mobile || ""}`,
      14,
      startY
    );
    startY += 6;
    doc.text(`To GSTIN: ${bill.to_customer_gst || "-"}`, 14, startY);
    startY += 6;
    doc.text(
      `Lorry: ${bill.lorry_name || ""} - ${bill.lorry_number || ""}`,
      14,
      startY
    );
    doc.text(
      `Driver: ${bill.driver_name || ""} (${bill.driver_number || ""})`,
      100,
      startY
    );
    startY += 8;
    autoTable(doc, {
      startY: startY,
      head: [
        ["#", "Product Type", "Description", "Quantity", "Amount", "Discount"],
      ],
      body: productsArr.map((p, idx) => [
        idx + 1,
        p.product_type || "",
        p.description || "",
        p.quantity || "",
        p.amount || "",
        p.discount || "",
      ]),
      theme: "striped",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { left: 14, right: 14 },
    });
    const tableEndY = doc.lastAutoTable.finalY || startY + 20;
    doc.setFontSize(11);
    doc.text(`Payment Status: ${bill.payment_status || ""}`, 14, tableEndY + 6);
    if (bill.sgst_amount || bill.cgst_amount) {
      doc.text(`Subtotal: ${bill.subtotal_amount || 0}`, 14, tableEndY + 12);
      doc.text(`SGST: ${bill.sgst_amount || 0}`, 14, tableEndY + 18);
      doc.text(`CGST: ${bill.cgst_amount || 0}`, 14, tableEndY + 24);
      doc.text(`Total Amount: ${bill.total_amount || 0}`, 150, tableEndY + 24);
    } else {
      doc.text(`Total Amount: ${bill.total_amount || 0}`, 150, tableEndY + 6);
    }
    const termsY =
      bill.sgst_amount || bill.cgst_amount ? tableEndY + 30 : tableEndY + 12;
    doc.setFontSize(9);
    doc.text("Terms and Conditions:", 14, termsY);
    const termsText = termsConditions.value || defaultTerms();
    doc.setFontSize(8);
    const splitTerms = doc.splitTextToSize(termsText, 180);
    doc.text(splitTerms, 14, termsY + 4);
    if (index < lrBills.value.length - 1) {
      doc.setDrawColor(180);
      doc.line(
        14,
        doc.lastAutoTable.finalY + 35,
        200,
        doc.lastAutoTable.finalY + 35
      );
    }
  });
  doc.save("LR_Bills_Detailed.pdf");
}

function triggerPrint(id) {
  const bill = lrBills.value.find((b) => b.id === id);
  if (bill) {
    alert(`Printing LR Bill: ${bill.lr_number}`);
  }
}

function defaultTerms() {
  return `1. The goods are transported at the owner's risk.
2. The transporter is not responsible for any damage caused due to natural calamities.
3. Payment terms must be followed as per agreement.
4. All disputes are subject to local jurisdiction.
5. The transporter reserves the right to withhold delivery until payment is settled.
6. Ensure accurate details are provided to avoid delays.
7. Any additional charges incurred during transit must be borne by the customer.
8. Signing the LR Bill confirms acceptance of these conditions.`;
}