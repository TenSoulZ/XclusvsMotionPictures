import axios from 'axios';
import fs from 'fs';
import FormData from 'form-data';

async function test() {
    try {
        // Authenticate first
        const tokenRes = await axios.post('https://xmp-backend.onrender.com/api/api-token-auth/', {
            username: 'admin',
            password: 'admin123'
        });
        const token = tokenRes.data.token;
        
        // Get blog post to patch
        const blogRes = await axios.get('https://xmp-backend.onrender.com/api/blog/');
        const blogSlug = blogRes.data.results[0].slug;
        console.log('Patching blog:', blogSlug);

        // Prepare form data
        const form = new FormData();
        form.append('title', 'Testing Frontend Upload');
        
        // Create a dummy image file
        fs.writeFileSync('dummy.jpg', Buffer.from('dummy image data'));
        form.append('featured_image', fs.createReadStream('dummy.jpg'));
        
        const res = await axios.patch(`https://xmp-backend.onrender.com/api/blog/${blogSlug}/`, form, {
            headers: {
                'Authorization': `Token ${token}`,
                ...form.getHeaders()
            }
        });
        console.log('Success:', res.status);
    } catch (e) {
        console.log('Error:', e.response?.status);
        console.log('Data:', e.response?.data);
    }
}

test();
