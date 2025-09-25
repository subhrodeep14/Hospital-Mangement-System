import React, { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Purchase } from '../types';
import { X, Download, Printer } from 'lucide-react';
import { hospitalInfo } from '../data/mockData';

interface BillGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  purchase: Purchase;
}

const BillGenerator: React.FC<BillGeneratorProps> = ({
  isOpen,
  onClose,
  purchase
}) => {
  const billRef = useRef<HTMLDivElement>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePrint = () => {
    const printContent = billRef.current;
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Bill - ${purchase.billNumber}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                .bill-container { max-width: 800px; margin: 0 auto; }
                .header { text-align: center; margin-bottom: 30px; }
                .hospital-name { font-size: 24px; font-weight: bold; color: #1e40af; }
                .bill-title { font-size: 20px; font-weight: bold; margin: 20px 0; }
                .info-section { margin: 20px 0; }
                .info-row { display: flex; justify-content: space-between; margin: 5px 0; }
                .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .table th, .table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                .table th { background-color: #f8f9fa; font-weight: bold; }
                .total-section { margin-top: 30px; }
                .total-row { display: flex; justify-content: space-between; margin: 5px 0; }
                .grand-total { font-size: 18px; font-weight: bold; border-top: 2px solid #000; padding-top: 10px; }
                .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
                @media print {
                  body { margin: 0; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body>
              ${printContent.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  const handleDownload = () => {
    generatePDF();
  };

  const generatePDF = async () => {
    const billElement = billRef.current;
    if (!billElement) return;

    try {
      // Create a clone of the element to avoid modifying the original
      const clonedElement = billElement.cloneNode(true) as HTMLElement;
      
      // Apply PDF-specific styles
      clonedElement.style.width = '210mm'; // A4 width
      clonedElement.style.padding = '20mm';
      clonedElement.style.backgroundColor = 'white';
      clonedElement.style.fontFamily = 'Arial, sans-serif';
      
      // Temporarily add to DOM for rendering
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.top = '0';
      document.body.appendChild(clonedElement);

      // Generate canvas from HTML
      const canvas = await html2canvas(clonedElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123 // A4 height in pixels at 96 DPI
      });

      // Remove cloned element
      document.body.removeChild(clonedElement);

      // Create PDF
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // 10mm margin on each side
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add image to PDF
      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, Math.min(imgHeight, pdfHeight - 20));
      
      // Save PDF
      const fileName = `Bill_${purchase.billNumber}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to print
      handlePrint();
    }
  };

  if (!isOpen) return null;

  const subtotal = purchase.totalAmount;
  const taxRate = 0.18; // 18% GST
  const taxAmount = subtotal * taxRate;
  const grandTotal = subtotal + taxAmount;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b no-print">
          <h2 className="text-2xl font-bold text-gray-900">Bill Generator</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-gray-400 hover:text-green-600 transition-colors"
              title="Print"
            >
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div ref={billRef} className="p-8 bill-container">
          {/* Header */}
          <div className="header text-center mb-8">
            <h1 className="hospital-name text-3xl font-bold text-blue-600 mb-2">
              {hospitalInfo.name}
            </h1>
            <p className="text-gray-600 mb-1">{hospitalInfo.address}</p>
            <p className="text-gray-600 mb-1">Phone: {hospitalInfo.phone} | Email: {hospitalInfo.email}</p>
            <p className="text-gray-600">Website: {hospitalInfo.website}</p>
            <div className="bill-title text-2xl font-bold text-gray-800 mt-6 mb-4">
              PURCHASE BILL
            </div>
          </div>

          {/* Bill Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="info-section">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bill Details</h3>
              <div className="info-row">
                <span className="font-medium">Bill Number:</span>
                <span>{purchase.billNumber}</span>
              </div>
              <div className="info-row">
                <span className="font-medium">Purchase Date:</span>
                <span>{formatDate(purchase.purchaseDate)}</span>
              </div>
              <div className="info-row">
                <span className="font-medium">Payment Method:</span>
                <span>{purchase.paymentMethod}</span>
              </div>
              <div className="info-row">
                <span className="font-medium">Payment Status:</span>
                <span className={`px-2 py-1 rounded text-sm ${
                  purchase.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' :
                  purchase.paymentStatus === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-blue-100 text-blue-700'
                }`}>
                  {purchase.paymentStatus}
                </span>
              </div>
            </div>

            <div className="info-section">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Vendor Details</h3>
              <div className="info-row">
                <span className="font-medium">Vendor Name:</span>
                <span>{purchase.vendorName}</span>
              </div>
              <div className="info-row">
                <span className="font-medium">Contact:</span>
                <span>{purchase.vendorContact}</span>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="table w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left">Equipment Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-center">Quantity</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Unit Price</th>
                  <th className="border border-gray-300 px-4 py-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-3">{purchase.equipmentName}</td>
                  <td className="border border-gray-300 px-4 py-3 text-center">{purchase.quantity}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right">{formatCurrency(purchase.unitPrice)}</td>
                  <td className="border border-gray-300 px-4 py-3 text-right font-medium">{formatCurrency(purchase.totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total Section */}
          <div className="total-section flex justify-end">
            <div className="w-80">
              <div className="total-row flex justify-between py-2">
                <span>Subtotal:</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div className="total-row flex justify-between py-2">
                <span>GST (18%):</span>
                <span>{formatCurrency(taxAmount)}</span>
              </div>
              <div className="grand-total total-row flex justify-between py-3 text-xl font-bold border-t-2 border-gray-800">
                <span>Grand Total:</span>
                <span>{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {purchase.notes && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Notes</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{purchase.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="footer mt-12 pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
            <p>Thank you for your business!</p>
            <p className="mt-2">This is a computer-generated bill and does not require a signature.</p>
            <p className="mt-4 font-medium">
              For any queries, please contact us at {hospitalInfo.phone} or {hospitalInfo.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillGenerator;