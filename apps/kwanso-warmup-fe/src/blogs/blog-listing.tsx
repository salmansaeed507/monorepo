import { gql, useLazyQuery, useQuery } from "@apollo/client";
import { useState } from "react";
import { Button, Col, Row } from "react-bootstrap";
import { Blog } from "../Blog";

export function BlogListing() {
    const [keyword, setKeyword] = useState("")
    const [blogs, setBlogs] = useState([])
    const [isSearch, setIsSearch] = useState(false)

    function handleSearch() {
        if (!keyword) {
            setBlogs([])
            setIsSearch(false)
        }
        queryFunc({
            variables: {
                keyword
            }
        }).then((d) => {
            setBlogs(d.data.search)
            setIsSearch(true)
        })
    }

    const SEARCH_BLOGS = gql`
        query SearchBlogs($keyword: String!){
            search(keyword: $keyword){
                id
                title
                shortDescription
                imageUrl
                user {
                    email
                }
            }
        }
        `;
    const [queryFunc] = useLazyQuery(SEARCH_BLOGS);

    const GET_DOGS = gql`
            query {
                blogs {
                    id
                    title
                    shortDescription
                    imageUrl
                    user {
                        email
                    }
                }   
            }
        `;
    let { loading, error, data } = useQuery(GET_DOGS);

    if (loading)  return <div>Loading</div>
    if (error) return <p style={{color: "red"}}>{error.message}</p>
    
    return (
    <Row className="blog-container">
        <input type="text" className="form-control" placeholder="Search Blogs" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
        <Button onClick={handleSearch}>Search</Button>
        {!isSearch && data.blogs?.map(function(blog: any){
            return (
                <Col className="col-4">
                    <Blog blog={blog} />
                </Col>
            )
        })}
        {blogs?.map(function(blog: any){
            return (
                <Col className="col-4">
                    <Blog blog={blog} />
                </Col>
            )
        })}
    </Row>)
    
        
}