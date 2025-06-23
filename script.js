document.addEventListener('DOMContentLoaded', function() {
    // Initialize Particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles', {
            particles: {
                number: {
                    value: 80,
                    density: {
                        enable: true,
                        value_area: 800
                    }
                },
                color: {
                    value: '#4a6fa5'
                },
                shape: {
                    type: 'circle'
                },
                opacity: {
                    value: 0.5,
                    random: false,
                    anim: {
                        enable: false
                    }
                },
                size: {
                    value: 3,
                    random: true,
                    anim: {
                        enable: false
                    }
                },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#4a6fa5',
                    opacity: 0.4,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 2,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: {
                        enable: true,
                        mode: 'grab'
                    },
                    onclick: {
                        enable: true,
                        mode: 'push'
                    },
                    resize: true
                },
                modes: {
                    grab: {
                        distance: 140,
                        line_linked: {
                            opacity: 1
                        }
                    },
                    push: {
                        particles_nb: 4
                    }
                }
            },
            retina_detect: true
        });
    }

    // Animate background gradient sphere
    const gradientSphere = document.querySelector('.gradient-sphere');
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
        
        gradientSphere.style.transform = `translate(${mouseX * 100}px, ${mouseY * 100}px)`;
    });

    // Add scroll animations
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.template-card, .form-group, .section-title');
        elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            if (elementTop < window.innerHeight && elementBottom > 0) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };

    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check

    // DOM Elements
    const certificateForm = document.getElementById('certificateForm');
    const downloadBtn = document.getElementById('downloadBtn');
    const thumbnails = document.querySelectorAll('.template-thumbnail');
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const useTemplateBtns = document.querySelectorAll('.use-template-btn');
    const canvas = document.getElementById('certificateCanvas');
    const ctx = canvas.getContext('2d');
    const csvInput = document.getElementById('csvInput');
    const recipientNameInput = document.getElementById('recipientName');
    
    // Template images with more reliable URLs
    const templateImages = {
        classic: 'https://i.imgur.com/QZqoFlY.png',  // Placeholder for classic template
        modern: 'https://i.imgur.com/NF987fX.png',   // Placeholder for modern template
        elegant: 'https://i.imgur.com/7dXBqeX.png'   // Placeholder for elegant template
    };
    
    // Template handling
    let customTemplate = null;  // Declare customTemplate at the top level
    let currentTemplate = 'classic';
    
    // Default certificate data
    const templates = {
        classic: {
            bgColor: '#f8f8f8',
            textColor: '#333',
            borderColor: '#4a6fa5',
            titleFont: '40px Georgia',
            nameFont: 'bold 48px Georgia',
            textFont: '24px Arial'
        },
        modern: {
            bgColor: '#ffffff',
            textColor: '#166088',
            borderColor: '#166088',
            titleFont: '38px Arial',
            nameFont: 'bold 44px Palatino',
            textFont: '22px Arial'
        },
        elegant: {
            bgColor: '#fffaf0',
            textColor: '#5a3921',
            borderColor: '#c0a080',
            titleFont: '42px Palatino',
            nameFont: 'bold 46px Georgia',
            textFont: '20px Times New Roman'
        }
    };
    
    // Initialize with current date
    document.getElementById('date').valueAsDate = new Date();
    
    // Function to load template image with error handling
    function loadTemplateImage(templateName) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            
            img.onload = () => {
                console.log(`Template ${templateName} loaded successfully`);
                resolve(img);
            };
            
            img.onerror = () => {
                console.error(`Failed to load template image: ${templateName}`);
                // Create a fallback canvas with a basic design
                const fallbackCanvas = document.createElement('canvas');
                fallbackCanvas.width = 800;
                fallbackCanvas.height = 600;
                const ctx = fallbackCanvas.getContext('2d');
                
                // Draw a basic certificate background
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(0, 0, 800, 600);
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 10;
                ctx.strokeRect(20, 20, 760, 560);
                
                // Convert canvas to image
                const fallbackImg = new Image();
                fallbackImg.src = fallbackCanvas.toDataURL();
                fallbackImg.onload = () => resolve(fallbackImg);
            };
            
            img.src = templateImages[templateName];
        });
    }

    // Function to draw template image on canvas
    async function drawTemplateImage(templateName) {
        try {
            console.log('Loading template:', templateName);
            const img = await loadTemplateImage(templateName);
            
            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Calculate scaling to maintain aspect ratio
            const scale = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
            );
            
            const x = (canvas.width - img.width * scale) / 2;
            const y = (canvas.height - img.height * scale) / 2;
            
            // Draw image
            ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
            
            console.log('Template drawn successfully');
            return true;
        } catch (error) {
            console.error('Error drawing template:', error);
            return false;
        }
    }

    // Separate function for certificate content
    function generateCertificateContent(recipientName = '') {
        const name = recipientName || document.getElementById('recipientName').value;
        const courseTitle = "WORKSHOP";
        const certificateText = "This is to certify that they have completely completed their Workshop'25";
        
        // Format today's date
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const formattedDate = `${day}/${month}/${year}`;
        
        const textColor = document.getElementById('textColor').value;
        const fontFamily = document.getElementById('fontFamily').value;
        
        // Add title
        ctx.fillStyle = textColor || templates[currentTemplate].textColor;
        ctx.font = templates[currentTemplate].titleFont;
        ctx.textAlign = 'center';
        ctx.fillText('CERTIFICATE OF ACHIEVEMENT', canvas.width/2, 100);
        
        // Add certificate text
        const lines = wrapText(ctx, certificateText, canvas.width - 100, 24);
        let yPosition = 200;
        
        lines.forEach(line => {
            ctx.fillStyle = textColor || templates[currentTemplate].textColor;
            ctx.font = '24px ' + fontFamily;
            ctx.fillText(line, canvas.width/2, yPosition);
            yPosition += 30;
        });
        
        // Add recipient name
        if (name) {
            ctx.fillStyle = textColor || '#166088';
            ctx.font = templates[currentTemplate].nameFont;
            ctx.fillText(name, canvas.width/2, yPosition + 50);
        }
        
        // Add course title
        ctx.fillStyle = textColor || templates[currentTemplate].textColor;
        ctx.font = '28px ' + fontFamily;
        ctx.fillText(courseTitle, canvas.width/2, yPosition + 100);
        
        // Add date
        ctx.fillStyle = '#666';
        ctx.font = '20px ' + fontFamily;
        ctx.fillText('Date: ' + formattedDate, canvas.width/2, canvas.height - 100);
        
        // Add signature line
        ctx.fillStyle = textColor || templates[currentTemplate].textColor;
        ctx.font = '20px ' + fontFamily;
        ctx.fillText('_________________________', canvas.width/2, canvas.height - 60);
        ctx.fillText('Authorized Signature', canvas.width/2, canvas.height - 30);
    }

    // Modified generateCertificate function
    async function generateCertificate(recipientName = '') {
        try {
            console.log('Starting certificate generation for:', recipientName);
            
            const name = recipientName || document.getElementById('recipientName').value;
            if (!name) {
                alert('Please enter a recipient name');
                return null;
            }

            // Clear canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw template
            if (customTemplate) {
                console.log('Using custom template');
                drawCustomTemplate();
            } else if (currentTemplate) {
                console.log('Using default template:', currentTemplate);
                // Draw default template
                ctx.strokeStyle = '#000000';
                ctx.lineWidth = 10;
                ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
            }

            // Add text with background
            const addText = (text, x, y, font) => {
                ctx.font = font;
                
                // Measure text
                const metrics = ctx.measureText(text);
                const textWidth = metrics.width;
                const textHeight = parseInt(font.split('px')[0]) * 1.2;
                
                // Add semi-transparent background
                ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
                ctx.fillRect(
                    x - textWidth/2 - 10,
                    y - textHeight/2,
                    textWidth + 20,
                    textHeight
                );
                
                // Draw text
                ctx.fillStyle = document.getElementById('textColor').value || '#000000';
                ctx.fillText(text, x, y);
            };

            // Add all text elements
            ctx.textAlign = 'center';
            
            // Title
            addText('Certificate of Achievement', canvas.width/2, 100, 'bold 40px Arial');
            
            // Name
            addText(name, canvas.width/2, 250, 'bold 30px Arial');
            
            // Course
            addText("has successfully completed", canvas.width/2, 300, '24px Arial');
            addText("WORKSHOP '25", canvas.width/2, 350, '24px Arial');
            
            // Date
            const date = new Date().toLocaleDateString();
            addText(`Date: ${date}`, canvas.width/2, 450, '20px Arial');
            
            // Signature
            addText('_____________________', canvas.width/2, 500, '20px Arial');
            addText('Authorized Signature', canvas.width/2, 530, '20px Arial');

            console.log('Certificate generated successfully');
            return canvas.toDataURL('image/png');
        } catch (error) {
            console.error('Error generating certificate:', error);
            alert('Error generating certificate: ' + error.message);
            return null;
        }
    }

    // Helper function to wrap text
    function wrapText(context, text, maxWidth) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = words[0];
        
        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = context.measureText(currentLine + ' ' + word).width;
            if (width < maxWidth) {
                currentLine += ' ' + word;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    // Function to download certificate
    function downloadCertificate(dataUrl, recipientName) {
        try {
            console.log('Starting download process');
            
            // Create a temporary canvas to handle the download
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = canvas.width;
            tempCanvas.height = canvas.height;
            
            // Draw the certificate on the temporary canvas
            const tempCtx = tempCanvas.getContext('2d');
            const img = new Image();
            img.onload = function() {
                tempCtx.drawImage(img, 0, 0);
                
                // Create download link
                const link = document.createElement('a');
                link.download = `certificate_${recipientName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
                link.href = tempCanvas.toDataURL('image/png');
                
                // Trigger download
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                console.log('Download initiated');
            };
            img.src = dataUrl;
        } catch (error) {
            console.error('Download error:', error);
            alert('Error downloading certificate: ' + error.message);
        }
    }

    // Form submission handler
    certificateForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        console.log('Form submitted');
        
        const recipientName = document.getElementById('recipientName').value.trim();
        if (!recipientName) {
            alert('Please enter a recipient name');
            return;
        }

        const certificateDataUrl = await generateCertificate(recipientName);
        if (certificateDataUrl) {
            downloadCertificate(certificateDataUrl, recipientName);
        }
    });

    // Modified CSV input handler
    document.getElementById('csvInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) {
            alert('No file selected');
            return;
        }

        console.log('Processing CSV file:', file.name);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async function(results) {
                try {
                    if (!results.data || results.data.length === 0) {
                        alert('CSV file is empty');
                        return;
                    }

                    if (!results.meta.fields.includes('recipientName')) {
                        alert('CSV must have a column named "recipientName"');
                        return;
                    }

                    let processedCount = 0;
                    const totalCount = results.data.length;

                    // Process each row
                    for (const row of results.data) {
                        const name = row.recipientName.trim();
                        if (name) {
                            // Generate certificate with current template (custom or default)
                            const certificateDataUrl = await generateCertificate(name);
                            
                            if (certificateDataUrl) {
                                // Create download link
                                const link = document.createElement('a');
                                link.download = `certificate_${name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.png`;
                                link.href = certificateDataUrl;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);

                                processedCount++;
                                console.log(`Processed ${processedCount} of ${totalCount}: ${name}`);

                                // Add a small delay between certificates
                                await new Promise(resolve => setTimeout(resolve, 1000));
                            }
                        }
                    }

                    alert(`Successfully generated ${processedCount} certificates!`);
                } catch (error) {
                    console.error('Error processing CSV:', error);
                    alert('Error processing CSV file: ' + error.message);
                }
            },
            error: function(error) {
                console.error('Error parsing CSV:', error);
                alert('Error reading CSV file: ' + error.message);
            }
        });
    });

    // Modified thumbnail click handler
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', function() {
            // Clear custom template when selecting a predefined one
            customTemplate = null;
            currentTemplate = this.dataset.template;
            thumbnails.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            generateCertificate();
        });
    });

    // Template buttons from templates section
    useTemplateBtns.forEach(btn => {
        btn.addEventListener('click', async function() {
            currentTemplate = this.dataset.template;
            thumbnails.forEach(t => t.classList.remove('active'));
            const thumbnail = document.querySelector(`.template-thumbnail[data-template="${currentTemplate}"]`);
            if (thumbnail) {
                thumbnail.classList.add('active');
            }
            generateCertificate();
            document.getElementById('generator').scrollIntoView({ behavior: 'smooth' });
        });
    });
    
    // File upload handling
    uploadArea.addEventListener('click', () => fileInput.click());
    
    // Modified file input change handler
    fileInput.addEventListener('change', function(e) {
        if (this.files && this.files[0]) {
            handleTemplateFile(this.files[0]);
        }
    });
    
    // Modified drag and drop handlers
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.backgroundColor = 'rgba(0, 123, 255, 0.1)';
        this.style.borderColor = '#007bff';
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.backgroundColor = '';
        this.style.borderColor = '';
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        e.stopPropagation();
        this.style.backgroundColor = '';
        this.style.borderColor = '';

        if (e.dataTransfer.files.length > 0) {
            handleTemplateFile(e.dataTransfer.files[0]);
        }
    });
    
    // Modified handleTemplateFile function
    function handleTemplateFile(file) {
        if (!file || !file.type.startsWith('image/')) {
            alert('Please upload an image file (PNG, JPG, etc.)');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            customTemplate = new Image();
            customTemplate.crossOrigin = "Anonymous";
            
            customTemplate.onload = function() {
                console.log('Custom template loaded:', customTemplate.width, 'x', customTemplate.height);
                
                // Clear any active template selections
                thumbnails.forEach(t => t.classList.remove('active'));
                currentTemplate = null; // Disable default template
                
                // Draw the custom template immediately
                drawCustomTemplate();
                
                // Generate preview with the new template
                generateCertificate(document.getElementById('recipientName').value);
            };
            
            customTemplate.onerror = function() {
                console.error('Error loading custom template');
                alert('Error loading template image. Please try another image.');
                customTemplate = null;
            };
            
            customTemplate.src = e.target.result;
        };
        
        reader.onerror = function() {
            console.error('Error reading template file');
            alert('Error reading template file. Please try again.');
        };
        
        reader.readAsDataURL(file);
    }
    
    // Initialize with default certificate
    generateCertificate();

    // Initialize with default template
    window.addEventListener('load', async () => {
        console.log('Initializing default template');
        await drawTemplateImage('classic');
        generateCertificateContent();
    });

    // Add drawCustomTemplate function
    function drawCustomTemplate() {
        if (!customTemplate) {
            console.log('No custom template available');
            return;
        }

        console.log('Drawing custom template');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Calculate scaling to maintain aspect ratio
        const scale = Math.min(
            canvas.width / customTemplate.width,
            canvas.height / customTemplate.height
        );

        const x = (canvas.width - customTemplate.width * scale) / 2;
        const y = (canvas.height - customTemplate.height * scale) / 2;

        try {
            // Draw template
            ctx.drawImage(
                customTemplate,
                x, y,
                customTemplate.width * scale,
                customTemplate.height * scale
            );
            console.log('Custom template drawn successfully');
        } catch (error) {
            console.error('Error drawing custom template:', error);
            alert('Error drawing template. Please try another image.');
        }
    }
}); 