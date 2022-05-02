import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  Autocomplete
} from "@mui/material";
import React, { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import useAlert from "../hooks/useAlert";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import api, {
  Category,
  TestByDiscipline,
  TestByTeacher,
} from "../services/api";
import Form from "../components/Form";
import Disciplines from "./Disciplines";

const styles = {
    container: {
      marginTop: "40px",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      textAlign: "center",
    },
    title: { marginBottom: "30px" },
    dividerContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      marginTop: "16px",
      marginBottom: "26px",
    },
    input: { marginBottom: "16px", width: "100%" },
    actionsContainer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    },
    autocomplete: { marginBottom: "16px", width: "100%" }
  };

interface FormData {
    title: string;
    file: string;
    category: string;
    discipline: string;
    teacher: string;
  }

function Add() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [terms, setTerms] = useState<TestByDiscipline[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [teachersDisciplines, setTeachersDisciplines] = useState<
    TestByTeacher[]
  >([]);

  const { setMessage } = useAlert();
  const [formData, setFormData] = useState<FormData>({
    title: "",
    file: "",
    category: "",
    discipline: "",
    teacher: ""
  });

  useEffect(() => {
    async function loadPage() {
      if (!token) return;

      const { data: testsData } = await api.getTestsByTeacher(token);
      setTeachersDisciplines(testsData.tests);
      const { data: categoriesData } = await api.getCategories(token);
      setCategories(categoriesData.categories);
      
    }
    loadPage();
  }, [token]);


  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  }

  function handleTest (e: React.ChangeEvent<HTMLInputElement>) {
    console.log()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    console.log(formData)
    if (
      !formData?.title ||
      !formData?.file ||
      !formData?.category ||
      !formData?.discipline ||
      !formData?.teacher
    ) {
      setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
      return;
    }

    const { title, file, category, discipline, teacher } = formData;

    try {
      await api.addTest({ title, file, category, discipline, teacher });
      setMessage({ type: "success", text: "Prova adicionada com sucesso!" });
      navigate("/");
    } catch (error: Error | AxiosError | any) {
      if (error.response) {
        setMessage({
          type: "error",
          text: error.response.data,
        });
        return;
      }
      setMessage({
        type: "error",
        text: "Erro, tente novamente em alguns segundos!",
      });
    }
  }

  return (
    <>
        <Typography
            sx= {{ marginX: "auto", marginBottom: "25px" }}
        >Adicione uma prova</Typography>

      <Divider sx={{ marginBottom: "35px" }} />
      <Box
        sx={{
          marginX: "auto",
          width: "700px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            variant="outlined"
            onClick={() => navigate("/app/disciplinas")}
          >
            Disciplinas
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate("/app/pessoas-instrutoras")}
          >
            Pessoa Instrutora
          </Button>
          <Button variant="contained" type="submit">
            Adicionar
          </Button>
        </Box>
        <Box sx={styles.container}>

        <Form onSubmit={handleSubmit}>
        <TextField
          name="title"
          sx={styles.input}
          label="Título da prova"
          type="text"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.title}
        />
        <TextField
          name="file"
          sx={styles.input}
          label="PDF da prova"
          type="text"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.file}
        />
       
        <Autocomplete
            options={categories.map((category) => category.name)}
            sx={styles.input}
            //value={formData.category}
            //onInputChange={handleInputChange}
            //inputValue='p1'
            //onInputChange={handleInputChange}
            //nputValue={option}
            renderInput={(params) => 
                <TextField 
                    {...params}
                    label="Categoria" 
                    type="text"
                    name="category"
                    //onChange={handleInputChange}
                    // value={formData.category}
                    />}
                />
        <Autocomplete
            disablePortal
            id="discipline"
            options={teachersDisciplines.map((item) => item.discipline.name)}
            sx={styles.input}
            renderInput={(params) => 
                <TextField 
                    {...params} 
                    label="Disciplina" 
                    name="discipline"
                    type="text"
                    onChange={handleInputChange}
                    value={formData.discipline}/>}
        />
        <Autocomplete
            disablePortal
            id="teacher"
            options={teachersDisciplines.map((item) => item.teacher)}
            getOptionLabel={(option) => option.name}


            sx={styles.input}
            renderInput={(params) => 
                <TextField 
                    {...params} 
                    label="Pessoa instrutora" 
                    name="teacher"
                    type="text"
                    onChange={handleInputChange}
                    value={formData.teacher}/>}
        />
        <Box sx={styles.actionsContainer}>
          <Button sx={{ width: "100%" }} variant="contained" type="submit">
            Adicionar
          </Button>
        </Box>
        </Form>
        </Box>
      </Box>
    </>
  );
}


export default Add;
