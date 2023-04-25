import React, { useEffect, useState } from 'react'
import swal from 'sweetalert';

function Products() {
    const [loading, setloading] = useState(false)
    const [allactivecategorys, setallactivecategorys] = useState([]);
    const [formData, setformData] = useState({
        category_id: "",
        meta_title: "",
        meta_description: "",
        meta_keyword: "",
        slug: "",
        name: "",
        description: "",
        selling_price: 0,
        original_price: 0,
        quantity:0,
        errorList: []
    });
    const [checkbox, setcheckbox] = useState({
        featured: 0,
        popular: 0,
        status: 0,

    })
    const [picture, setpicture] = useState({
        image: "",

    })

    const changeHandler = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    }
    const checkboxhandler = (e) => {
        setcheckbox({ ...checkbox, [e.target.name]: e.target.checked === true ? 1 : 0 });
    }
    const imageHandler = (e) => {
        setpicture({ image: e.target.files[0] });
    }
    function xsrftoken() {
        var allCookie = decodeURIComponent(document.cookie).split(';');
        for (let i = 0; i < allCookie.length; i++) {
            var singleCookie = allCookie[i];
            if (singleCookie.match('XSRF-TOKEN')) {
                return singleCookie.substr(singleCookie.search("=") + 1, singleCookie.length);

            }

        }
    }
    const submithandler = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('category_id', formData.category_id)
        data.append('meta_description', formData.meta_description)
        data.append('meta_keyword', formData.meta_keyword)
        data.append('meta_title', formData.meta_title)
        data.append('description', formData.description)
        data.append('slug', formData.slug)
        data.append('name', formData.name)
        data.append('original_price', formData.original_price)
        data.append('selling_price', formData.selling_price)
        data.append('image', picture.image)
        data.append('popular', checkbox.popular)
        data.append('featured', checkbox.featured)
        data.append('status', checkbox.status)
        data.append('quantity', formData.quantity)

        


        // const data = {
        //     id: formData.id,
        //     category_id: formData.category_id,
        //     meta_title: formData.meta_title,
        //     meta_keyword: formData.meta_keyword,
        //     description: formData.description,
        //     meta_description: formData.meta_description,
        //     slug: formData.slug,
        //     name: formData.name,
        //     selling_price: formData.selling_price,
        //     original_price: formData.original_price,
        //     image: picture.image,
        //     featured: checkbox.featured ,
        //     popular: checkbox.popular === true? 1:0,
        //     status: checkbox.status === true? 1:0,
        // };
        // console.log(data);
        fetch(`${process.env.REACT_APP_API_URL}/api/admin/addproduct`, {
            method: "POST",
            body: data,
            headers: {
                "Accept": "application/json",
                "X-XSRF-TOKEN": xsrftoken()
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                if (res.status === 200) {
                    setformData({ ...formData, errorList: [] });
                    swal("success", res.msg);
                } else if (res.status === 404) {
                    setformData({ ...formData, errorList: res.Validationerrors });
                } else if (res.status === 400) {
                    swal("Error", res.msg);
                } else if (res.status === 410) {
                    swal("Not An Admin", res.msg);
                }

            })
    }
    useEffect(() => {
        setloading(true);
        fetch(`${process.env.REACT_APP_API_URL}/api/admin/getactivecategory`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-XSRF-TOKEN": xsrftoken()
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                setloading(false);
                if (res.status === 200) {
                    // localStorage.setItem('auth-token', res.token)
                    setallactivecategorys(res.activecategorie);
                } else if (res.status === 400) {
                    swal("Error", res.msg);
                } else if (res.status === 410) {
                    swal("Not An Admin", res.msg);
                }
            })
    }, [])


    if (loading) {
        return (
            <div>loading</div>
        )
    } else {
        return (
            <div className='container py-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-6'>
                        <div className='card'>
                            <div className='card-header'>
                                <h4>Add products</h4>
                            </div>
                            <div className='card-body'>
                                <form onSubmit={(event) => submithandler(event)}>
                                    <div className='form-group mb-3'>
                                        <label>Category</label>
                                        <select name='category_id' value={formData.category_id} onChange={(event) => changeHandler(event)}>
                                            <option value="">select</option>
                                            {allactivecategorys.map((e, index) => <option key={index} value={e.id}>{e.name}</option>)}
                                        </select>
                                        <span>{formData.errorList["category_id"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Meta Title</label>
                                        <input type='text' name='meta_title' value={formData.meta_title} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["meta_title"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Meta Keyword</label>
                                        <input type='text' name='meta_keyword' value={formData.meta_keyword} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["meta_keyword"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Meta Description</label>
                                        <input type='text' name='meta_description' value={formData.meta_description} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["meta_description"]}</span>
                                    </div><div className='form-group mb-3'>
                                        <label>Slug</label>
                                        <input type='text' name='slug' value={formData.slug} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["slug"]}</span>
                                    </div><div className='form-group mb-3'>
                                        <label>Name</label>
                                        <input type='text' name='name' value={formData.name} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["name"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Description</label>
                                        <input type='text' name='description' value={formData.description} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["description"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Selling Price</label>
                                        <input type='number' name='selling_price' value={formData.selling_price} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["selling_price"]}</span>
                                    </div>
                                    
                                    <div className='form-group mb-3'>
                                        <label>Original price</label>
                                        <input type='number' name='original_price' value={formData.original_price} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["original_price"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Quantity</label>
                                        <input type='number' name='quantity' value={formData.quantity} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["quantity"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Image</label>
                                        <input type='file' name='image' onChange={(event) => imageHandler(event)} />
                                        <span>{formData.errorList["image"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>featured</label>
                                        <input type='checkbox' name='featured' onChange={(event) => checkboxhandler(event)} />
                                        <span>{formData.errorList["featured"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>popular</label>
                                        <input type='checkbox' name='popular' onChange={(event) => checkboxhandler(event)} />
                                        <span>{formData.errorList["popular"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>status</label>
                                        <input type='checkbox' name='status' onChange={(event) => checkboxhandler(event)} />
                                        <span>{formData.errorList["status"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <button className='btn btn-primary' type='submit'>Add product</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Products