export default function Image({src,...rest}) {
    src = src && src.includes('https://')
      ? src
      : 'hotel-mingle-api.vercel.app/uploads/'+src;
    return (
      <img {...rest} src={src} alt={''} />
    );
  }
