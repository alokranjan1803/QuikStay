export default function Image({ src, ...rest }) {
  src =
    src && src.includes("https://")
      ? src
<<<<<<< HEAD
      : `${import.meta.env.VITE_API_BASE_URL}/uploads/` + src;
  return <img {...rest} src={src} alt={""} />;
}
=======
      : `${import.meta.env.VITE_API_BASE_URL}/uploads/`+src;
    return (
      <img {...rest} src={src} alt={''} />
    );
  }
>>>>>>> 2c8d1640395eb02a0f722982f6fe8f9712139938
