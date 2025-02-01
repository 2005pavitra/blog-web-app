import React, {useState} from 'react'


function Blog() {

    const [blogData, setblogData] = useState({
        title:"",
        category:"",
        description:"",
        blogImage:"",
        createdBy:""
    });

    const handleChange = (e) =>{
        const {name,value} = e.target;
        setblogData({
            ...blogData,
            [name]:value
        })
    }

    const handleFileChange = (e) => {
        setblogData({
            ...blogData,
            blogImage: e.target.files[0]
        });
    };

    const createBlog =async (blogData) =>{
        try {
            const response = await fetch("http://localhost:4000/api/blogs/create",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify(blogData)
            })
            if(!response.ok){
                throw new Error("Error while creating blog")
            } 

           const data = response.json();
           return data;

            
        }
        catch(error){
            console.error(error);
            throw error;
        }

    }

    const createBlogSubmit = async (e) =>{
        e.preventDefault();

        try {
            const data = await createBlog(blogData);
            console.log("Blog created successfully",data);
     
        } catch (error) {
            console.log("Error while creating blog",error)
        }
    }



    return (
        <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Create a Blog</h2>
            
            <form onSubmit={createBlogSubmit}>
                <input type="text" name="title" placeholder="Title" value={blogData.title} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
                <input type="file" name="blogImage"  placeholder="Image URL"  onChange={handleFileChange} className="w-full p-2 mb-2 border rounded" required />
                <input type="text" name="category" placeholder="Category" value={blogData.category} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required />
                <textarea name="description" placeholder="Description" value={blogData.description} onChange={handleChange} className="w-full p-2 mb-2 border rounded" required></textarea>
                <input type="text" name="createdBy" placeholder="Created By" value={blogData.createdBy} onChange={handleChange} className="w-full p-2 mb-4 border rounded" required />
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">Submit</button>
            </form>
        </div>
    );
};

export default Blog;