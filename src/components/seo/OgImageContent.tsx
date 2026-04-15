export default function OgImageContent({ text }: { text: string }) {
  return (
    <div
      style={{
        fontSize: 60,
        background: '#f7f7f8',
        color: '#333',
        border: '20px solid #ff7e0f',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: 60,
      }}
    >
      {text}
    </div>
  );
}
