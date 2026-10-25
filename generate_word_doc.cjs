const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle, PageBreak } = require('docx')
const fs = require('fs')
const path = require('path')

const FONT_FAMILY = 'Times New Roman'

function createHeading(text, level, spacingBefore = 240, spacingAfter = 120) {
  return new Paragraph({
    text: text,
    heading: level,
    spacing: { before: spacingBefore, after: spacingAfter },
    run: {
      font: FONT_FAMILY,
      bold: true,
      color: '0B192C'
    }
  })
}

function createPara(text, options = {}) {
  const isIndent = options.indent !== false
  return new Paragraph({
    alignment: options.alignment || AlignmentType.JUSTIFIED,
    spacing: { before: options.before || 60, after: options.after || 120, line: 360 },
    indent: isIndent ? { firstLine: 400 } : undefined,
    children: [
      new TextRun({
        text: text,
        font: FONT_FAMILY,
        size: options.size || 24, // 12pt
        bold: options.bold || false,
        italics: options.italics || false,
        color: options.color || '111111'
      })
    ]
  })
}

function createBullet(text, boldPrefix = '') {
  const runs = []
  if (boldPrefix) {
    runs.push(new TextRun({ text: boldPrefix + ' ', bold: true, font: FONT_FAMILY, size: 24 }))
  }
  runs.push(new TextRun({ text: text, font: FONT_FAMILY, size: 24 }))
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 60, line: 320 },
    children: runs
  })
}

async function buildWordDoc() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              bottom: 1440,
              left: 1800, // 1.25 inch
              right: 1440
            }
          }
        },
        children: [
          // ==================== PAGE 1: TITLE / COVER PAGE ====================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
            children: [
              new TextRun({ text: 'A Project Report On', font: FONT_FAMILY, size: 28, bold: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 100 },
            children: [
              new TextRun({ text: 'Nexus POS', font: FONT_FAMILY, size: 48, bold: true, color: '0B192C' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 60, after: 40 },
            children: [
              new TextRun({ text: 'For', font: FONT_FAMILY, size: 24, bold: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 300 },
            children: [
              new TextRun({ text: 'Raje Ramrao Mahavidyalaya, Jath', font: FONT_FAMILY, size: 30, bold: true, color: '8B0000' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 60 },
            children: [
              new TextRun({ text: 'Submitted to', font: FONT_FAMILY, size: 24, bold: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 60 },
            children: [
              new TextRun({ text: 'Shivaji University, Kolhapur', font: FONT_FAMILY, size: 32, bold: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'In Partial fulfillment for the Degree of', font: FONT_FAMILY, size: 22, italics: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 300 },
            children: [
              new TextRun({ text: 'Bachelor of Computer Application (Sem-VI)', font: FONT_FAMILY, size: 26, bold: true, color: '003366' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({ text: 'By: ', font: FONT_FAMILY, size: 24, bold: true }),
              new TextRun({ text: 'Rihan Shabbir Mulla', font: FONT_FAMILY, size: 26, bold: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.LEFT,
            spacing: { before: 40, after: 300 },
            children: [
              new TextRun({ text: 'Under the guidance of: ', font: FONT_FAMILY, size: 24, bold: true }),
              new TextRun({ text: 'Balikai J.I (M.C.A)', font: FONT_FAMILY, size: 26, bold: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({ text: 'Through,', font: FONT_FAMILY, size: 22, bold: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'The Principal,', font: FONT_FAMILY, size: 24, bold: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 60 },
            children: [
              new TextRun({ text: 'Raje Ramrao Mahavidyalaya, Jath', font: FONT_FAMILY, size: 28, bold: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 100 },
            children: [
              new TextRun({ text: 'In the Year 2026-2027', font: FONT_FAMILY, size: 24, bold: true })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== PAGE 2: CERTIFICATE ====================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({ text: 'Swami Vivekanand Shikshan Sanstha’s', font: FONT_FAMILY, size: 24, bold: true })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: 'Raje Ramrao Mahavidyalaya, Jath', font: FONT_FAMILY, size: 28, bold: true, color: '8B0000' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 40, after: 200 },
            children: [
              new TextRun({ text: 'Department of B.C.A.', font: FONT_FAMILY, size: 24, bold: true, color: '003366' })
            ]
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 250 },
            children: [
              new TextRun({ text: 'CERTIFICATE', font: FONT_FAMILY, size: 32, bold: true, underline: {} })
            ]
          }),
          createPara('This is to certify that the project report entitled Nexus POS is record of project work, carried out in this college by Rihan Shabbir Mulla in the partial fulfillment of award of Bachelor of Computer Application-III (Sem–VI) as laid down by Shivaji University, Kolhapur.', { before: 100, after: 150 }),
          createPara('This report presents their sincere work carried out under my guidance.', { before: 100, after: 250 }),
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({ text: 'Place: Jath.', font: FONT_FAMILY, size: 24, bold: true })
            ]
          }),
          new Paragraph({
            spacing: { before: 40, after: 300 },
            children: [
              new TextRun({ text: 'Date: _____ / _____ / 2026', font: FONT_FAMILY, size: 24, bold: true })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.NONE },
              bottom: { style: BorderStyle.NONE },
              left: { style: BorderStyle.NONE },
              right: { style: BorderStyle.NONE },
              insideHorizontal: { style: BorderStyle.NONE },
              insideVertical: { style: BorderStyle.NONE }
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Balikai J.I\nProject Guide', bold: true, font: FONT_FAMILY, size: 24 })] })
                    ]
                  }),
                  new TableCell({
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Mr. Mali P.D\nHOD', bold: true, font: FONT_FAMILY, size: 24 })] })
                    ]
                  })
                ]
              })
            ]
          }),
          new Paragraph({
            spacing: { before: 300, after: 40 },
            children: [
              new TextRun({ text: 'Examiner:', font: FONT_FAMILY, size: 24, bold: true })
            ]
          }),
          new Paragraph({
            spacing: { before: 40, after: 40 },
            children: [
              new TextRun({ text: '1) _________________________________________________', font: FONT_FAMILY, size: 24 })
            ]
          }),
          new Paragraph({
            spacing: { before: 40, after: 100 },
            children: [
              new TextRun({ text: '2) _________________________________________________', font: FONT_FAMILY, size: 24 })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== PAGE 3: DECLARATION ====================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({ text: 'DECLARATION', font: FONT_FAMILY, size: 30, bold: true, underline: {} })
            ]
          }),
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({ text: 'To,\nThe Registrar,\nShivaji University,\nKolhapur.', font: FONT_FAMILY, size: 24, bold: true })
            ]
          }),
          new Paragraph({
            spacing: { before: 100, after: 80 },
            children: [
              new TextRun({ text: 'Sir,', font: FONT_FAMILY, size: 24, bold: true })
            ]
          }),
          createPara('We undersigned, Rihan Shabbir Mulla hereby to declare that, the project report Nexus POS submitted by under the guidance of Balikai J.I is our original work. We have not reproduced any information about from any report submitted to Shivaji University, Kolhapur this year or any of the previous years.', { before: 80, after: 120 }),
          createPara('We undersigned that any such coping is liable to the punishment in a way that University Authorities deem fit.', { before: 80, after: 200 }),
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({ text: 'Date: _____ / _____ / 2026', font: FONT_FAMILY, size: 24 })
            ]
          }),
          new Paragraph({
            spacing: { before: 40, after: 200 },
            children: [
              new TextRun({ text: 'Place: Jath.', font: FONT_FAMILY, size: 24 })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Exam Seat No.', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Name of Member', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Signature', bold: true, font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '_________________', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Rihan Shabbir Mulla', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT_FAMILY })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== PAGE 4: ACKNOWLEDGEMENT ====================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({ text: 'ACKNOWLEDGEMENT', font: FONT_FAMILY, size: 30, bold: true, underline: {} })
            ]
          }),
          createPara('We express a very good & greatest moment of my life to put forward this project named Nexus POS With the submission of this project we would like to Thank here as we named the people who have given their valuable time to accomplish this project.', { before: 100, after: 120 }),
          createPara('At the start, we glad to bow before our guide Balikai J.I The contributions made by the whole faculty members of our college & staff, we also thank full to our friends & well-wishers, who are responsible for the progress of this project.', { before: 100, after: 200 }),
          new Paragraph({
            spacing: { before: 100, after: 40 },
            children: [
              new TextRun({ text: 'Place: Jath.', font: FONT_FAMILY, size: 24 })
            ]
          }),
          new Paragraph({
            spacing: { before: 40, after: 200 },
            children: [
              new TextRun({ text: 'Date: _____ / _____ / 2026', font: FONT_FAMILY, size: 24 })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Exam Seat No.', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Name of Member', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Signature', bold: true, font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '_________________', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Rihan Shabbir Mulla', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: ' ', font: FONT_FAMILY })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== PAGE 5: INDEX ====================
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 100, after: 200 },
            children: [
              new TextRun({ text: 'INDEX', font: FONT_FAMILY, size: 30, bold: true, underline: {} })
            ]
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'SrNo', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ width: { size: 70, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: 'Chapter Name', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ width: { size: 15, type: WidthType.PERCENTAGE }, children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Page No', bold: true, font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '1', font: FONT_FAMILY, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Chapter Name - System Analysis\n• Background of the problem\n• Existing system and its Limitations\n• Objective of the project\n• Scope of the project', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '6', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '2', font: FONT_FAMILY, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Chapter Name - System Study / Proposed System\n• 2.1 Software Development Model\n• 2.2 Feasibility Study', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '8', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '3', font: FONT_FAMILY, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Chapter Name - Requirement Analysis\n• 3.1 Functional Requirements\n• 3.2 Non-Functional Requirements\n• 3.3 Hardware & Software Requirements', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '10', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '4', font: FONT_FAMILY, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Chapter Name - System Design\n• 4.1 System Architecture Diagram / DFD\n• 4.2 Database Design (ER Diagram)', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '12', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '5', font: FONT_FAMILY, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Chapter Name - Implementation\n• 5.1 Module-wise Screenshots of Input & Output design\n• 5.2 Reports\n• 5.3 Code snippets (important parts only)', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '15', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '6', font: FONT_FAMILY, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Chapter Name - Testing\n• 6.1 Testing methodology', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '19', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '7', font: FONT_FAMILY, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Chapter Name - Conclusion & Future Scope\n• 7.1 Summary of work\n• 7.2 Limitations\n• 7.3 Learning outcomes\n• 7.4 Possible enhancements', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '21', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '8', font: FONT_FAMILY, bold: true })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Bibliography', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [new TextRun({ text: '23', font: FONT_FAMILY })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 1 ====================
          createHeading('CHAPTER 1: SYSTEM ANALYSIS', HeadingLevel.HEADING_1, 100, 150),
          createHeading('1.1 Background of the Problem', HeadingLevel.HEADING_2, 100, 80),
          createPara('In physical retail stores (such as grocery supermarkets, electrical shops, clothing boutiques, and independent retail outlets in regional towns like Jath and across Maharashtra), billing and inventory tracking form the core daily operations. Historically, storekeepers relied on handwritten ledger books or basic disconnected desktop spreadsheets.'),
          createPara('While modern cloud-based Software-as-a-Service (SaaS) POS platforms have emerged, they require uninterrupted high-speed internet connections and recurring monthly subscriptions. In semi-urban and rural retail hubs, internet connectivity frequently fluctuates or drops. When a cloud POS disconnects, the cashier cannot scan barcodes, generate bills, or calculate balances, leading to long customer queues, transaction abandonment, and severe financial losses.'),

          createHeading('1.2 Existing System and Its Limitations', HeadingLevel.HEADING_2, 120, 80),
          createPara('The existing systems used by small merchants fall into two categories:'),
          createBullet('Prone to manual mathematical errors in tax, discount, and change calculations.', '1. Manual Paper Ledgers:'),
          createBullet('No automated stock decrement upon billing; inventory counts require time-consuming manual audits.', '2. Stock Discrepancy:'),
          createBullet('Zero customer purchase history tracking or automated loyalty reward calculations.', '3. Lack of CRM:'),
          createBullet('Cloud POS halts operations during internet cutoffs, creating cashier deadlocks.', '4. Internet Fragility:'),
          createBullet('Recurring monthly platform fees ($89+/month) plus transaction percentage cuts eat into small business margins.', '5. High Recurring Overhead:'),
          createBullet('Store sales records and customer phone numbers are hosted on third-party remote clouds.', '6. Data Privacy Vulnerability:'),

          createHeading('1.3 Objective of the Project', HeadingLevel.HEADING_2, 120, 80),
          createBullet('To build a 100% offline-first desktop application with zero internet reliance.'),
          createBullet('To provide sub-10 millisecond billing response times using local SQLite embedded storage.'),
          createBullet('To enforce Role-Based Access Control (RBAC) separating Admin settings from Staff checkout actions.'),
          createBullet('To protect user credentials using memory-hard cryptographic password hashing (scrypt).'),
          createBullet('To integrate hardware USB barcode scanners via keyboard emulation event listeners.'),
          createBullet('To support dual-format invoice compilation: standard A4 documents and 80mm POS thermal receipt rolls.'),
          createBullet('To automate inventory decrement on checkout and restock restoration on refund.'),

          createHeading('1.4 Scope of the Project', HeadingLevel.HEADING_2, 120, 80),
          createPara('The scope of Nexus POS covers single-terminal physical retail establishments, including department stores, pharmacies, hardware outlets, and apparel shops. It encompasses product catalog management, barcode-driven billing, customer CRM with loyalty points, daily expense auditing, graphical revenue reporting, and local database disaster backup.'),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 2 ====================
          createHeading('CHAPTER 2: SYSTEM STUDY / PROPOSED SYSTEM', HeadingLevel.HEADING_1, 100, 150),
          createHeading('2.1 Software Development Model', HeadingLevel.HEADING_2, 100, 80),
          createPara('The project was developed using the Agile Iterative Prototyping Model. This software engineering methodology allowed rapid phase-by-phase development, continuous refinement, and rigorous verification:'),
          createBullet('Decoupled Electron multi-process design and schema creation.', 'Phase 1 (Requirements & Architecture):'),
          createBullet('Rapid UI wireframing with React and Vite for sub-second hot reload.', 'Phase 2 (Core Inventory & POS Terminal):'),
          createBullet('Integrated jsPDF for dual compilation of A4 invoices and 80mm thermal rolls.', 'Phase 3 (Billing & Dual PDF Engine):'),
          createBullet('Implemented scrypt cryptographic hashing and customer loyalty points.', 'Phase 4 (Enterprise Security & CRM):'),
          createBullet('Built daily expense tracking and net profit math (Revenue minus Expenses).', 'Phase 5 (Financial Auditing & Expenses):'),
          createBullet('Wrote automated Vitest unit test suites and packaged standalone Windows .exe installers.', 'Phase 6 (Automated QA & Packaging):'),

          createHeading('2.2 Feasibility Study', HeadingLevel.HEADING_2, 120, 80),
          createPara('A three-dimensional feasibility analysis was conducted before initiating technical development:'),
          createBullet('Built on Electron v39.x, React 19, and SQLite3. These technologies run natively on standard commodity PC hardware without needing expensive server configurations or high-end graphics processing units.', '1. Technical Feasibility:'),
          createBullet('The UI is built with high-contrast, modern glassmorphism dark aesthetics and intuitive ergonomics. Cashiers with basic computer literacy can scan barcodes and issue receipts with zero training.', '2. Operational Feasibility:'),
          createBullet('The software uses 100% open-source libraries and embedded SQLite. It imposes ₹0 recurring monthly server costs, zero cloud subscription fees, and eliminates recurring licensing charges.', '3. Economic Feasibility:'),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 3 ====================
          createHeading('CHAPTER 3: REQUIREMENT ANALYSIS', HeadingLevel.HEADING_1, 100, 150),
          createHeading('3.1 Functional Requirements', HeadingLevel.HEADING_2, 100, 80),
          createBullet('Login portal with RBAC distinguishing Admin and Staff privileges.', 'FR-1 (Authentication):'),
          createBullet('Full CRUD capabilities for products (SKU, Name, Price, Stock).', 'FR-2 (Product Catalog):'),
          createBullet('Fast cart additions, item count toggles, and barcode scan interception.', 'FR-3 (POS Checkout):'),
          createBullet('Support Cash, Card, UPI, and partial payment balance calculation.', 'FR-4 (Split-Payment & Dues):'),
          createBullet('Client-side dynamic PDF compilation in A4 and 80mm thermal roll formats.', 'FR-5 (Invoicing Engine):'),
          createBullet('Cancellation workflow restoring sold quantities back to inventory stock.', 'FR-6 (Refund & Restock):'),
          createBullet('Customer telephone lookup with automated +1 point per unit spent.', 'FR-7 (CRM & Loyalty):'),
          createBullet('Recording daily operational expenses (rent, electricity, tea, supplies).', 'FR-8 (Expense Ledger):'),
          createBullet('Single-click local backup of the raw SQLite database file.', 'FR-9 (Disaster Recovery):'),

          createHeading('3.2 Non-Functional Requirements', HeadingLevel.HEADING_2, 120, 80),
          createBullet('Sub-10 millisecond database response times for instantaneous barcode lookups.', 'Performance:'),
          createBullet('100% uptime with zero internet dependency.', 'Availability:'),
          createBullet('Credential protection via salted scrypt hashes with timing-safe validation.', 'Security:'),
          createBullet('Full ACID compliance guaranteed by SQLite transactions.', 'Data Integrity:'),

          createHeading('3.3 Hardware & Software Requirements', HeadingLevel.HEADING_2, 120, 80),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Component', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Development Environment', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Deployment / Client Machine', bold: true, font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Operating System', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Windows 11 (64-bit)', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Windows 10 / 11, macOS, Linux', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Processor', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Intel Core i5 (11th Gen)', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Dual Core x86_64 CPU (1.8 GHz+)', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'RAM', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '8 GB / 16 GB DDR4', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '4 GB DDR4 Minimum', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Hard Disk', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '512 GB NVMe SSD', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: '500 MB Free Disk Space', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Database', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'SQLite3 embedded', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Embedded inventory_billing.db', font: FONT_FAMILY })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 4 ====================
          createHeading('CHAPTER 4: SYSTEM DESIGN', HeadingLevel.HEADING_1, 100, 150),
          createHeading('4.1 System Architecture Diagram / DFD', HeadingLevel.HEADING_2, 100, 80),
          createPara('Nexus POS implements Electron\'s multi-process architecture. The Main Process runs in Node.js and executes privileged disk I/O and SQLite operations. The Renderer Process renders the React 19 UI inside a secure Chromium sandbox. Communication is strictly routed through an asynchronous IPC (Inter-Process Communication) bridge.'),
          createBullet('External Entities: Administrator, Cashier/Staff, Customer. Inputs: Barcode scans, Credentials, Cart items, Tendered payments, Expenses. Outputs: A4/Thermal bills, Stock availability warnings, Analytics, Backup file.', 'DFD Level 0 (Context Diagram):'),
          createBullet('Process 1.0 (Auth & RBAC) queries D1 (users). Process 2.0 (Inventory Control) reads/writes D2 (products). Process 3.0 (POS & Billing) queries D2, writes D3 (invoices), fetches settings from D6. Process 4.0 (CRM & Loyalty) writes points to D4. Process 5.0 (Expenses) logs costs to D5. Process 6.0 (Analytics) aggregates D2, D3, D5.', 'DFD Level 1 (Process Decomposition):'),
          createBullet('3.1 Input SKU -> 3.2 Validate Stock (>0) -> 3.3 Cart Math (Subtotal, Tax, Total) -> 3.4 Split Tender Calculation -> 3.5 SQLite Transaction (Deduct stock, insert invoice, credit points).', 'DFD Level 2 (POS Checkout Sub-Process):'),

          createHeading('4.2 Database Design (ER Diagram)', HeadingLevel.HEADING_2, 120, 80),
          createPara('The database schema is fully normalized into seven relational tables in SQLite:'),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Table Name', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Primary Key', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Attributes & Role', bold: true, font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'users', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'id (INTEGER)', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'username (UNIQUE), password (scrypt hash), role (Admin/Staff)', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'products', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'id (INTEGER)', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'name, sku (UNIQUE barcode), price, stock', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'invoices', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'id (INTEGER)', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'customer_name, phone, date, total, amount_paid, balance_due, payment_method, status', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'invoice_items', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'id (INTEGER)', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'invoice_id (FK), product_id (FK), quantity, price', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'customers', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'id (INTEGER)', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'name, phone (UNIQUE), points (accrued loyalty)', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'expenses', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'id (INTEGER)', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'description, amount, date', font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'settings', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'key (TEXT)', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'value (store_name, tax_rate, currency)', font: FONT_FAMILY })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 5 ====================
          createHeading('CHAPTER 5: IMPLEMENTATION', HeadingLevel.HEADING_1, 100, 150),
          createHeading('5.1 Module-wise Screenshots of Input & Output Design', HeadingLevel.HEADING_2, 100, 80),
          createBullet('Dark-themed login portal validating salted scrypt hashes. Restricts staff from administrative links.', '1. Authentication & Login Screen:'),
          createBullet('Split-screen layout. Left catalog displays product cards with real-time stock; right panel shows calculated cart, tax calculations, payment buttons, and print triggers.', '2. POS Terminal & Checkout Screen:'),
          createBullet('CRUD interface for catalog SKUs, names, pricing, and quantities with low-stock badges (<=5 units).', '3. Inventory Management Screen:'),
          createBullet('KPI summary cards (Gross Revenue, Total Catalog Items, Low Stock Warnings) and weekly performance graph.', '4. Executive Dashboard Screen:'),
          createBullet('Customer directory searchable by phone number with auto-suggest datalist during checkout.', '5. CRM & Loyalty Rewards Screen:'),

          createHeading('5.2 Reports', HeadingLevel.HEADING_2, 120, 80),
          createPara('Nexus POS compiles invoices client-side using jsPDF and jsPDF-AutoTable in two layout formats:'),
          createBullet('Clean full-page document including store metadata, invoice numbers, customer phone numbers, itemized tables, subtotal, tax breakdown, and signature blocks.', '1. Standard A4 Tax Invoice:'),
          createBullet('Formatted specifically for 80mm thermal receipt rolls with condensed typography, dashed dividers, and receipt footers.', '2. 80mm POS Thermal Receipt:'),

          createHeading('5.3 Code Snippets (Important Parts Only)', HeadingLevel.HEADING_2, 120, 80),
          createPara('1. Salted Cryptographic Key Derivation (scrypt in Node.js):', { indent: false, bold: true }),
          new Paragraph({
            spacing: { before: 40, after: 80 },
            children: [
              new TextRun({
                text: "const crypto = require('crypto')\n\n// Password Hashing\nconst salt = crypto.randomBytes(16).toString('hex')\nconst key = crypto.scryptSync(password, salt, 64).toString('hex')\nconst storedHash = `${salt}:${key}`\n\n// Timing-Safe Login Validation\nconst [salt, key] = user.password.split(':')\nconst keyBuffer = Buffer.from(key, 'hex')\nconst derivedKey = crypto.scryptSync(enteredPassword, salt, 64)\nconst isValid = crypto.timingSafeEqual(keyBuffer, derivedKey)",
                font: 'Courier New',
                size: 20
              })
            ]
          }),
          createPara('2. Hardware Barcode Keystroke Listener (Billing.jsx):', { indent: false, bold: true }),
          new Paragraph({
            spacing: { before: 40, after: 120 },
            children: [
              new TextRun({
                text: "useEffect(() => {\n  const handleKeyDown = (e) => {\n    if (e.key === 'Enter' && barcodeInput.length > 2) {\n      const product = products.find(p => p.sku === barcodeInput)\n      if (product) addToCart(product)\n      setBarcodeInput('')\n    } else if (e.key.length === 1) {\n      setBarcodeInput(prev => prev + e.key)\n      setTimeout(() => setBarcodeInput(''), 500)\n    }\n  }\n  window.addEventListener('keydown', handleKeyDown)\n  return () => window.removeEventListener('keydown', handleKeyDown)\n}, [barcodeInput, products])",
                font: 'Courier New',
                size: 20
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 6 ====================
          createHeading('CHAPTER 6: TESTING', HeadingLevel.HEADING_1, 100, 150),
          createHeading('6.1 Testing Methodology', HeadingLevel.HEADING_2, 100, 80),
          createPara('Software quality was validated through both Automated Unit Testing and Manual Functional Verification:'),
          createBullet('Configured with Vitest v5.x, React Testing Library, and JSDOM. Virtual IPC bridges were mocked to test React component lifecycles, user greetings, and cart state rendering in isolation.', 'Automated Test Suite:'),
          createBullet('Tested real-world checkout workflows, barcode scanning sequences, refund restocking, and database backup routines.', 'Manual Functional Verification:'),

          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Test ID', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Scenario Under Test', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Test Input', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Expected Outcome', bold: true, font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Result', bold: true, font: FONT_FAMILY })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TC-01', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Admin Authentication', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'admin / admin123', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Login success; access Dashboard', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'PASS', bold: true, font: FONT_FAMILY, color: '008000' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TC-02', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Staff RBAC Guard', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'staff1 / staff123', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Admin links hidden', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'PASS', bold: true, font: FONT_FAMILY, color: '008000' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TC-03', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Barcode Scan Checkout', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'SKU + Enter', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Item added to active cart', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'PASS', bold: true, font: FONT_FAMILY, color: '008000' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TC-04', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Inventory Auto-Deduct', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Sale of 2 units', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Stock decremented in SQLite', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'PASS', bold: true, font: FONT_FAMILY, color: '008000' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TC-05', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Invoice Refund Restock', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Click Refund', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Status Refunded; stock restored', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'PASS', bold: true, font: FONT_FAMILY, color: '008000' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TC-06', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Database Backup', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Trigger Backup', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Generates duplicate .db file', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'PASS', bold: true, font: FONT_FAMILY, color: '008000' })] })] })
                ]
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'TC-07', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Automated Vitest Suite', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'npm run test', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'All virtual component tests pass', font: FONT_FAMILY })] })] }),
                  new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'PASS', bold: true, font: FONT_FAMILY, color: '008000' })] })] })
                ]
              })
            ]
          }),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 7 ====================
          createHeading('CHAPTER 7: CONCLUSION & FUTURE SCOPE', HeadingLevel.HEADING_1, 100, 150),
          createHeading('7.1 Summary of Work', HeadingLevel.HEADING_2, 100, 80),
          createPara('Nexus POS demonstrates the viability of modern desktop retail architectures. By integrating React 19 and Vite with Electron and SQLite, the platform provides the visual fluidity of modern web applications while delivering the speed, data privacy, and zero-latency reliability of local embedded databases. It satisfies all functional requirements set forth by physical retail merchants.'),

          createHeading('7.2 Limitations', HeadingLevel.HEADING_2, 120, 80),
          createBullet('Operates locally on one PC; cannot yet sync across multiple cash registers simultaneously in large supermarkets.', 'Single-Terminal Scope:'),
          createBullet('ESC/POS cash drawer triggers currently rely on standard printer drivers rather than raw serial communication.', 'Hardware Hooks:'),

          createHeading('7.3 Learning Outcomes', HeadingLevel.HEADING_2, 120, 80),
          createBullet('Mastered Electron\'s decoupled multi-process architecture and secure IPC bridges using contextBridge.'),
          createBullet('Gained deep practical expertise in salted cryptographic key derivation algorithms (scrypt) and timing-safe equality checks.'),
          createBullet('Implemented hardware keyboard event interception in React for rapid barcode input.'),
          createBullet('Learned automated frontend unit testing using Vitest, JSDOM, and React Testing Library.'),

          createHeading('7.4 Possible Enhancements', HeadingLevel.HEADING_2, 120, 80),
          createBullet('Adding local WebSocket synchronization to connect multiple cashier terminals to a master register node.', 'LAN Multi-Counter Sync:'),
          createBullet('Direct binary communication to trigger automatic physical cash drawer kickouts and thermal paper cutters.', 'Hardware ESC/POS Drivers:'),
          createBullet('Scheduled end-to-end encrypted backup uploads to Google Drive or AWS S3.', 'Cloud Mirroring:'),

          new Paragraph({ children: [new PageBreak()] }),

          // ==================== CHAPTER 8 ====================
          createHeading('CHAPTER 8: BIBLIOGRAPHY', HeadingLevel.HEADING_1, 100, 150),
          createBullet('https://www.electronjs.org/docs/', '1. Electron Documentation: "Electron Application Architecture and Security Best Practices."'),
          createBullet('https://react.dev/', '2. React Core Team: "React 19 Documentation & Component Paradigms."'),
          createBullet('https://www.sqlite.org/', '3. D. Richard Hipp: "SQLite Database System Architecture & ACID Compliance."'),
          createBullet('BSDCAN Proceedings, 2009.', '4. Colin Percival: "Stronger Key Derivation via Sequential Memory-Hard Functions (scrypt)."'),
          createBullet('https://vitest.dev/', '5. Vitest Testing Framework: "Blazing Fast Unit Test Framework for Vite."'),
          createBullet('https://github.com/parallax/jsPDF', '6. James Parrott: "Client-side HTML5 and JavaScript PDF Generation."'),
          createBullet('8th Edition, McGraw-Hill Education.', '7. Pressman, Roger S.: Software Engineering: A Practitioner\'s Approach,'),
          createBullet('7th Edition, McGraw-Hill.', '8. Silberschatz, Korth, Sudarshan: Database System Concepts,')
        ]
      }
    ]
  })

  const buffer = await Packer.toBuffer(doc)

  const out1 = path.join(__dirname, 'SHIVAJI_UNIVERSITY_PROJECT_REPORT.docx')
  const out2 = path.join(__dirname, '..', 'SHIVAJI_UNIVERSITY_PROJECT_REPORT.docx')
  const out3 = path.join(__dirname, '..', 'Nexus_POS_Final_Submission', '02_Documentation', 'SHIVAJI_UNIVERSITY_PROJECT_REPORT.docx')

  fs.writeFileSync(out1, buffer)
  fs.writeFileSync(out2, buffer)
  fs.writeFileSync(out3, buffer)

  console.log('DOCX REPORT GENERATED SUCCESSFULLY!')
  console.log('Saved to:', out1)
  console.log('Saved to:', out2)
  console.log('Saved to:', out3)
}

buildWordDoc().catch(err => {
  console.error('Failed to generate docx:', err)
  process.exit(1)
})
