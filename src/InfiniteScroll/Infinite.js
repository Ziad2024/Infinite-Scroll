import { useRef, useCallback } from 'react'
import Post from './Post'
import { useInfiniteQuery } from 'react-query'
import { getPostsPage } from '../api/axios'

const InfiniteScroll = () => {
    const {
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        data,
        status,
        error
    } = useInfiniteQuery('/posts', ({ pageParam = 1 }) => getPostsPage(pageParam), {
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length ? allPages.length + 1 : undefined
        }
    })

    const intObserver = useRef()
    const lastPostRef =  useCallback(async (post) => {
        
        if (isFetchingNextPage) return

        if (intObserver.current) intObserver.current.disconnect()

        intObserver.current = new IntersectionObserver(posts => {
            if (posts[0].isIntersecting && hasNextPage) {
                console.log('We are near the last post!')
                fetchNextPage()
                // When you call fetchNextPage(),
                //  React Query internally calls the (getNextPageParam) function to determine the {pageParam} for fetching the next page of data.
            }
        })

        if (post) intObserver.current.observe(post)
    }, [isFetchingNextPage, fetchNextPage, hasNextPage])

    if (status === 'error') return <p className='center'>Error: {error.message}</p>
    console.log(data)

    const content = data?.pages.map(pg => {
        return pg.map((post, i) => {
            if (pg.length === i + 1) {
                return <Post ref={lastPostRef} key={post.id} post={post} />
            }
            return <Post key={post.id} post={post} />
        })
    })

    return (
        <>
        
            <h1 style={{color:'white'}} id="top">&infin; Infinite Query &amp; Scroll</h1>
            {content}
            {isFetchingNextPage && <p >Loading More Posts...</p>}
            <p className="center"><a href="#top">Back to Top</a></p>

        </>
    )
}
export default InfiniteScroll