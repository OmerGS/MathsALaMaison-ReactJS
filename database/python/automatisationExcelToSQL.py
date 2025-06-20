import pymysql
import pandas as pd
import os

connection = pymysql.connect(
    host='serverURI',
    port=XXXX, 
    user='XXXX', 
    password='mdp', 
    database='mathsALaMaison'
)

file_path = 'TableauQuestions.xlsx'  

df = pd.read_excel(file_path)

df.fillna('', inplace=True)

image_directory = './images'

with connection.cursor() as cursor:
    for index, row in df.iterrows():
        question = row['Question']
        type_question = row['Type de Question']
        correction = row['Correction']
        type_reponse = row['Type_de _Réponse']
        reponse = row['Reponse']
        image_flag = row['Image']

        question_number = row['Numero']

        print(f"Traitement de la question {question_number}: {question}")

        if image_flag.lower() != "non":
            image_name = f"Question{question_number}.png"
            image_path = os.path.join(image_directory, image_name)

            print(f"Recherche de l'image : {image_path}")

            if os.path.exists(image_path):
                print(f"Image trouvée : {image_name}")
                with open(image_path, 'rb') as img_file:
                    image_data = img_file.read()
            else:
                print(f"Image non trouvée pour {image_name}")
                image_data = None
        else:
            image_data = None

        insert_question_query = """
        INSERT INTO Questions (typeQuestion, question, typeReponse, reponse, correction, image_data)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor.execute(insert_question_query, (type_question, question, type_reponse, reponse, correction, image_data))

    connection.commit()

connection.close()

print("Insertion terminée.")