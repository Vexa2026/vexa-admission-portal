let currentStep = 1;
const MONTHLY_RATE = 10000;
let savedAppData = {};

window.calculateFee = function() {
  const durationSelect = document.getElementById('duration');
  const durationValue = durationSelect.value;
  const feeDisplay = document.getElementById('feeDisplay');

  let months = 0;
  if (durationValue === '1 Month') months = 1;
  else if (durationValue === '3 Months') months = 3;
  else if (durationValue === '6 Months') months = 6;
  else if (durationValue === '12 Months') months = 12;

  const totalFee = months * MONTHLY_RATE;
  feeDisplay.textContent = `₦${totalFee.toLocaleString('en-NG')}.00`;
};

window.nextStep = function(step) {
  if (validateStep(step)) {
    if (step < 4) {
      document.querySelector(`[data-content="${step}"]`).classList.remove('active');
      document.querySelector(`[data-step="${step}"]`).classList.remove('active');
      
      currentStep = step + 1;
      
      document.querySelector(`[data-content="${currentStep}"]`).classList.add('active');
      document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
    }
  }
};

window.prevStep = function(step) {
  document.querySelector(`[data-content="${step}"]`).classList.remove('active');
  document.querySelector(`[data-step="${step}"]`).classList.remove('active');
  
  currentStep = step - 1;
  
  document.querySelector(`[data-content="${currentStep}"]`).classList.add('active');
  document.querySelector(`[data-step="${currentStep}"]`).classList.add('active');
};

window.prepareReviewAndNext = function() {
  if (validateStep(3)) {
    generateReviewSummary();
    nextStep(3);
  }
};

function validateStep(step) {
  let isValid = true;
  clearErrors();

  if (step === 1) {
    const fields = ['fullName', 'email', 'phone', 'dob', 'gender'];
    fields.forEach(id => {
      const field = document.getElementById(id);
      if (!field.value.trim()) {
        showError(id, 'This field is required');
        isValid = false;
      }
    });
    const email = document.getElementById('email');
    if (email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
      showError('email', 'Please enter a valid email address');
      isValid = false;
    }
  } else if (step === 2) {
    const program = document.getElementById('program');
    const duration = document.getElementById('duration');
    if (!program.value) {
      showError('program', 'Please select a program');
      isValid = false;
    }
    if (!duration.value) {
      showError('duration', 'Please select program duration');
      isValid = false;
    }
  } else if (step === 3) {
    const fields = ['guardianName', 'guardianPhone'];
    fields.forEach(id => {
      const field = document.getElementById(id);
      if (!field.value.trim()) {
        showError(id, 'This field is required');
        isValid = false;
      }
    });
  }

  return isValid;
}

function generateReviewSummary() {
  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const dob = document.getElementById('dob').value;
  const gender = document.getElementById('gender').value;
  const program = document.getElementById('program').value;
  const duration = document.getElementById('duration').value;
  const educationLevel = document.getElementById('educationLevel').value || 'N/A';
  const guardianName = document.getElementById('guardianName').value;
  const guardianPhone = document.getElementById('guardianPhone').value;
  const feeText = document.getElementById('feeDisplay').textContent;

  const summaryHTML = `
    <p><strong>Full Name:</strong> ${fullName}</p>
    <p><strong>Email:</strong> ${email} | <strong>Phone:</strong> ${phone}</p>
    <p><strong>DOB:</strong> ${dob} | <strong>Gender:</strong> ${gender}</p>
    <hr style="margin: 8px 0; border:0; border-top:1px solid #cbd5e0;">
    <p><strong>Program:</strong> ${program}</p>
    <p><strong>Duration:</strong> ${duration}</p>
    <p><strong>Calculated Tuition Fee:</strong> <span style="color:#2b6cb0; font-weight:bold;">${feeText}</span></p>
    <p><strong>Current Level:</strong> ${educationLevel}</p>
    <hr style="margin: 8px 0; border:0; border-top:1px solid #cbd5e0;">
    <p><strong>Guardian:</strong> ${guardianName} (${guardianPhone})</p>
  `;

  document.getElementById('reviewSummary').innerHTML = summaryHTML;
}

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Generate Unique Application ID
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const appId = `VEXA-${new Date().getFullYear()}-${randomNum}`;
    const currentDate = new Date().toLocaleDateString();

    const fullName = document.getElementById('fullName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const dob = document.getElementById('dob').value;
    const gender = document.getElementById('gender').value;
    const program = document.getElementById('program').value;
    const duration = document.getElementById('duration').value;
    const educationLevel = document.getElementById('educationLevel').value || 'N/A';
    const guardianName = document.getElementById('guardianName').value;
    const guardianPhone = document.getElementById('guardianPhone').value;
    const guardianEmail = document.getElementById('guardianEmail').value || 'N/A';
    const feeText = document.getElementById('feeDisplay').textContent;
    const photoInput = document.getElementById('passportPhoto');
    const photoStatus = photoInput.files.length > 0 ? `Attached (${photoInput.files[0].name})` : 'Not attached';

    // Store data in memory
    savedAppData = {
      appId, fullName, email, phone, dob, gender, program, duration, educationLevel, guardianName, guardianPhone, guardianEmail, feeText, photoStatus
    };

    // Populate PDF Template Fields
    document.getElementById('pdfAppId').textContent = appId;
    document.getElementById('pdfDate').textContent = currentDate;
    document.getElementById('pdfFee').textContent = feeText;
    document.getElementById('pdfFullName').textContent = fullName;
    document.getElementById('pdfEmail').textContent = email;
    document.getElementById('pdfPhone').textContent = phone;
    document.getElementById('pdfDob').textContent = dob;
    document.getElementById('pdfGender').textContent = gender;
    document.getElementById('pdfProgram').textContent = program;
    document.getElementById('pdfDuration').textContent = duration;
    document.getElementById('pdfEducationLevel').textContent = educationLevel;
    document.getElementById('pdfGuardianName').textContent = guardianName;
    document.getElementById('pdfGuardianPhone').textContent = guardianPhone;

    // Open browser print window to save as PDF
    window.print();

    // Switch to Success & Payment Choice Screen immediately after print prompt
    document.querySelector('.form-header').style.display = 'none';
    form.style.display = 'none';
    
    document.getElementById('successAppId').textContent = appId;
    document.getElementById('successFee').textContent = feeText;
    document.getElementById('successScreen').style.display = 'block';
  });
});

window.showOpayDetails = function() {
  document.getElementById('opayBox').style.display = 'block';
};

window.sendToWhatsApp = function() {
  const d = savedAppData;
  const whatsappMessage = 
    `*New Admission Application - VEXA ACADEMY Warri* 🎓\n` +
    `*Tracking ID:* ${d.appId}\n\n` +
    `*Personal Info:*\n` +
    `- Name: ${d.fullName}\n` +
    `- Email: ${d.email}\n` +
    `- Phone: ${d.phone}\n` +
    `- DOB: ${d.dob}\n` +
    `- Gender: ${d.gender}\n\n` +
    `*Program & Fee Details:*\n` +
    `- Program: ${d.program}\n` +
    `- Duration: ${d.duration}\n` +
    `- Calculated Fee: ${d.feeText}\n` +
    `- Current Level: ${d.educationLevel}\n\n` +
    `*Guardian Info:*\n` +
    `- Guardian Name: ${d.guardianName}\n` +
    `- Guardian Phone: ${d.guardianPhone}\n` +
    `- Guardian Email: ${d.guardianEmail}\n` +
    `- Passport Photo: ${d.photoStatus}`;

  const whatsappNumber = '2348082821703'; 
  const encodedMessage = encodeURIComponent(whatsappMessage);
  const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

  window.open(whatsappURL, '_blank');
};

window.resetForm = function() {
  const form = document.getElementById('registrationForm');
  form.reset();
  document.getElementById('successScreen').style.display = 'none';
  document.getElementById('opayBox').style.display = 'none';
  document.querySelector('.form-header').style.display = 'block';
  form.style.display = 'block';
  
  document.querySelectorAll('.form-step').forEach(el => el.classList.remove('active'));
  document.querySelector('[data-content="1"]').classList.add('active');
  document.querySelectorAll('.step-indicator').forEach(el => el.classList.remove('active'));
  document.querySelector('[data-step="1"]').classList.add('active');
  currentStep = 1;
  document.getElementById('feeDisplay').textContent = '₦0.00';
  savedAppData = {};
};

function showError(fieldId, message) {
  const errorSpan = document.getElementById(`${fieldId}Error`);
  if (errorSpan) {
    errorSpan.textContent = message;
    errorSpan.style.display = 'block';
  }
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
  const statusMsg = document.getElementById('statusMessage');
  if(statusMsg) statusMsg.textContent = '';
}
