import Link from "next/link";

type Props = {
  params: {
    year: string;
  };
};

export default async function Page({ params }: Props) {
  const { year } = params;
  console.log(year)
  return (
    <section>
      <h1>年: {year}</h1>
    </section>
  );
}