import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportToPDF(buses, filename = 'brt-dashboard') {
  try {
    // Create PDF document
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;

    // Add title
    doc.setFontSize(20);
    doc.setTextColor(8, 6, 13);
    doc.text('BRT Live Dashboard Report', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;

    // Add timestamp
    doc.setFontSize(10);
    doc.setTextColor(107, 99, 117);
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 15;

    // Add summary stats
    doc.setFontSize(14);
    doc.setTextColor(8, 6, 13);
    doc.text('Summary Statistics', 20, yPosition);
    
    yPosition += 10;
    doc.setFontSize(11);
    doc.setTextColor(70, 70, 70);
    
    const totalPassengers = buses.reduce((sum, bus) => sum + (bus.passengers || 0), 0);
    const avgSpeed = buses.length > 0 
      ? (buses.reduce((sum, bus) => sum + (bus.speed || 0), 0) / buses.length).toFixed(1) 
      : 0;
    const maxDelay = Math.max(0, ...buses.map(bus => bus.delay || 0));

    doc.text(`Total Buses: ${buses.length}`, 25, yPosition);
    yPosition += 7;
    doc.text(`Average Speed: ${avgSpeed} km/h`, 25, yPosition);
    yPosition += 7;
    doc.text(`Total Passengers: ${totalPassengers}`, 25, yPosition);
    yPosition += 7;
    doc.text(`Maximum Delay: ${maxDelay} min`, 25, yPosition);
    
    yPosition += 15;

    // Add bus data table
    doc.setFontSize(14);
    doc.setTextColor(8, 6, 13);
    doc.text('Bus Fleet Details', 20, yPosition);
    
    yPosition += 10;

    // Table header
    doc.setFontSize(10);
    doc.setTextColor(255, 255, 255);
    doc.setFillColor(170, 59, 255);
    
    const columns = ['Route', 'Speed (km/h)', 'Passengers', 'Delay (min)', 'Location'];
    const columnWidths = [25, 30, 25, 25, 65];
    let xPos = 20;

    columns.forEach((col, index) => {
      doc.text(col, xPos, yPosition, { align: 'center' });
      xPos += columnWidths[index];
    });

    yPosition += 10;
    doc.setTextColor(70, 70, 70);
    doc.setFillColor(240, 240, 240);

    // Table rows
    buses.forEach((bus, idx) => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }

      if (idx % 2 === 0) {
        doc.rect(20, yPosition - 5, pageWidth - 40, 8, 'F');
      }

      xPos = 20;
      const busData = [
        bus.route || 'N/A',
        (bus.speed || 0).toFixed(1),
        bus.passengers || 0,
        bus.delay || 0,
        `${(bus.latitude || 0).toFixed(3)}, ${(bus.longitude || 0).toFixed(3)}`,
      ];

      busData.forEach((data, colIdx) => {
        doc.text(data.toString(), xPos + columnWidths[colIdx] / 2, yPosition, { 
          align: 'center',
          maxWidth: columnWidths[colIdx] - 2,
        });
        xPos += columnWidths[colIdx];
      });

      yPosition += 8;
    });

    // Save the PDF
    doc.save(`${filename}-${new Date().getTime()}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    alert('Failed to generate PDF. Please try again.');
    return false;
  }
}
