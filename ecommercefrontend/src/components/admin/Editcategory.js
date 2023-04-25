import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import swal from 'sweetalert';

function Editcategory() {
    const [formData, setformData] = useState({
        meta_title: "",
        meta_description: "",
        meta_keyword: "",
        slug: "",
        name: "",
        description: "",
        status: "",
        errorList: []
    });
    const [loading, setloading] = useState(false);
    const changeHandler = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    }
    const navigate = useNavigate();

    const { id } = useParams();
    function xsrftoken() {
        var allCookie = decodeURIComponent(document.cookie).split(';');
        for (let i = 0; i < allCookie.length; i++) {
            var singleCookie = allCookie[i];
            if (singleCookie.match('XSRF-TOKEN')) {
                return singleCookie.substr(singleCookie.search("=") + 1, singleCookie.length);

            }

        }
    }
    useEffect(() => {
        setloading(true);
        fetch(`${process.env.REACT_APP_API_URL}/api/admin/editcategory/${id}`, {
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
                    setformData({ ...formData, ...res.getCategory });
                } else if (res.status === 400) {
                    swal("Error", res.msg);
                } else if (res.status === 410) {
                    swal("Not An Admin", res.msg);
                }

            })

    }, [id])

    const submithandler = async (e) => {
        e.preventDefault();
        const data = {
            meta_title: formData.meta_title,
            meta_keyword: formData.meta_keyword,
            status: formData.status,
            description: formData.description,
            meta_description: FormData.meta_description,
            slug: formData.slug,
            name: formData.name,
        };
        await fetch(`${process.env.REACT_APP_API_URL}/api/admin/updatecategory/${id}`, {
            method: "PUT",
            body: JSON.stringify(data),
            headers: {
                "Accept": "application/json",

                "Content-Type": "application/json",
                "X-XSRF-TOKEN": xsrftoken()
            },
            credentials: 'include'
        }).then(res => res.json())
            .then(res => {
                if (res.status === 200) {
                    setformData({ ...formData, errorList: [] });
                    swal("success", res.msg);
                    navigate('/admin/viewcategories')

                } else if (res.status === 404) {
                    setformData({ ...formData, errorList: res.Validationerrors });
                } else if (res.status === 400) {
                    swal("Error", res.msg);
                } else if (res.status === 410) {
                    swal("Not An Admin", res.msg);
                }
            })
    }


    if (loading) {
        return (
            <h1>Loading</h1>
        )
    }
    else {
        return (
            <div className='container py-5'>
                <div className='row justify-content-center'>
                    <div className='col-md-6'>
                        <div className='card'>
                            <div className='card-header'>
                                <h4>Add Categories</h4>
                            </div>
                            <div className='card-body'>
                                <form onSubmit={(event) => submithandler(event)}>
                                    <div className='form-group mb-3'>
                                        <label>Meta Title</label>
                                        <input type='text' name='meta_title' value={formData.meta_title == null ? '' : formData.meta_title} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["meta_title"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Meta Keyword</label>
                                        <input type='text' name='meta_keyword' value={formData.meta_keyword == null ? '' : formData.meta_keyword} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["meta_keyword"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Meta Description</label>
                                        <input type='text' name='meta_description' value={formData.meta_description == null ? '' : formData.meta_description} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["meta_description"]}</span>
                                    </div><div className='form-group mb-3'>
                                        <label>Slug</label>
                                        <input type='text' name='slug' value={formData.slug == null ? '' : formData.slug} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["slug"]}</span>
                                    </div><div className='form-group mb-3'>
                                        <label>Name</label>
                                        <input type='text' name='name' value={formData.name == null ? '' : formData.name} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["name"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>Description</label>
                                        <input type='text' name='description' value={formData.description == null ? '' : formData.description} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["description"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <label>status</label>
                                        <input type='text' name='status' value={formData.status == null ? '' : formData.status} onChange={(event) => changeHandler(event)} className='form-control' />
                                        <span>{formData.errorList["status"]}</span>
                                    </div>
                                    <div className='form-group mb-3'>
                                        <button className='btn btn-primary' type='submit'>Update Category</button>
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

export default Editcategory