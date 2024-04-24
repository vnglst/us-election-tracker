from llama_index.llms import Ollama
from llama_index import VectorStoreIndex, SimpleDirectoryReader, ServiceContext
import os
import re
import time
import requests
from bs4 import BeautifulSoup


def download_articles(url, folder):
    response = requests.get(url, timeout=10)
    soup = BeautifulSoup(response.text, 'html.parser')

    for link in soup.find_all('a'):
        href = link.get('href')
        if not href or href.startswith('http'):
            continue

        article_url = f"https://lite.cnn.com{href}"
        print(f"Downloading {article_url}...")

        try:
            download_article(article_url, folder)
        except Exception as e:
            print(f"Error downloading {article_url}: {e}")


def download_article(url, folder):
    response = requests.get(url, timeout=10)
    soup = BeautifulSoup(response.text, 'html.parser')

    title = soup.find('h2')
    if title:
        title = title.text
    else:
        return

    # normalize title for filename format using underscore
    title_filename = re.sub(r'\W+', '_', title)

    content = ' '.join([p.text for p in soup.find_all('p')])

    with open(os.path.join(folder, f"{title_filename}.txt"), 'w', encoding='utf-8') as f:
        f.write('Source: ' + url + '\n\n')
        f.write(title + '\n\n')
        f.write(content)


input_folder = time.strftime("%Y-%m-%d")
if not os.path.exists(input_folder):
    os.makedirs(input_folder)

print(f"Downloading articles to {input_folder}...")

download_articles('https://lite.cnn.com/', input_folder)

print("Done.")


def get_answer(question):
    llm = Ollama(model="llama3:instruct")

    service_context = ServiceContext.from_defaults(
        llm=llm, embed_model="local")

    documents = SimpleDirectoryReader(input_folder).load_data()

    index = VectorStoreIndex.from_documents(
        documents, service_context=service_context)

    engine = index.as_chat_engine(verbose=False)
    return engine.chat(question).response


answer = get_answer(
    "What are the latest developments in the U.S. elections?")

print(answer)

output_filename = './web/public/answers/' + input_folder + '.txt'

with open(output_filename, 'w', encoding='utf-8') as f:
    f.write(answer)
