export default function Page(props: any) {
    return (
      <pre>
        {JSON.stringify(props, null, 2)}
      </pre>
    );
  }
  