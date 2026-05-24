# React 官方文档



地址：https://zh-hans.react.dev/





```jsx
function vider({ video }) {
  return (
  	<div>
    	<Thumbnai video={video} />
      <a href={video.url}>
      	<h3>{video.title}</h3>
        <p>{video.description}</p>
      </a>
      <LikeButton video={video} />
    </div>
  )
}
```

![image-20230510114727315](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202305101147443.png)



```jsx
function VideoList({ videos, emptyHeading }) {
  const count = videos.length;
  let heading = emptyHeading;
  if (count > 0) {
    const noun = count > 1 ? 'Videos' : 'Video';
    heading = count + ' ' + noun;
  }
  return (
    <section>
      <h2>{heading}</h2>
      {videos.map(video =>
        <Video key={video.id} video={video} />
      )}
    </section>
  );
}
```

![image-20230510114759009](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202305101147071.png)



```jsx
import { useState } from 'react';

function SearchableVideoList({ videos }) {
  const [searchText, setSearchText] = useState('');
  const foundVideos = filterVideos(videos, searchText);
  return (
    <>
      <SearchInput
        value={searchText}
        onChange={newText => setSearchText(newText)} />
      <VideoList
        videos={foundVideos}
        emptyHeading={`No matches for “${searchText}”`} />
    </>
  );
}
```

![image-20230510114825333](https://pic-liclo.oss-cn-chengdu.aliyuncs.com/img2/202305101148365.png)