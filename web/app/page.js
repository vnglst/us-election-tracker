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
    <main className="flex min-h-screen flex-col items-center p-12 md:p-24">
      <h1 className="text-4xl font-bold text-center pb-4">
        What are the latest developments in the U.S. elections?
      </h1>
      <p className="text-lg font-semibold text-gray-600 pb-12 text-center">
        Based on news coverage from CNN at{" "}
        <a href="https://lite.cnn.com/">lite.cnn.com</a>
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
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
