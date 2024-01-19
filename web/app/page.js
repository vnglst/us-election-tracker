import fs from "fs";

export default async function Home() {
  // load contents from files
  const files = fs.readdirSync("./public/answers");
  const answers = files.map((file) => {
    const content = fs.readFileSync(`./public/answers/${file}`, "utf8");
    const date = new Date(file.split(".")[0]).toLocaleDateString("en-UK", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    return { date, content };
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold text-center pb-8">
        A.I. generated news summaries U.S. elections
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {answers.map(({ date, content }, index) => {
          return (
            <div key={index} className="bg-gray-100 p-4">
              <p className="text-sm font-bold text-gray-500">{date}</p>
              <p className="text-sm">{content}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
