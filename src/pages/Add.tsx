import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Box,
  Button,
  Divider,
  TextField,
  Typography,
  Autocomplete,
  MenuItem,
  InputLabel,
  Select,
  SelectChangeEvent,
  FormControl
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
    name: string;
    pdfUrl: string;
    categoryId: number;
    disciplineId: number;
    teacherId: number;
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
    name: "",
    pdfUrl: "",
    categoryId: 0,
    disciplineId: 0,
    teacherId: 0
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


  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSelectChange (e: SelectChangeEvent<number>) {
      console.log(e.target.value)
    setFormData({ ...formData, [e.target.name]: e.target.value })
    console.log(formData)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);
    console.log(formData)
    if (
      !formData?.name ||
      !formData?.pdfUrl ||
      !formData?.categoryId ||
      !formData?.disciplineId ||
      !formData?.teacherId
    ) {
      setMessage({ type: "error", text: "Todos os campos são obrigatórios!" });
      return;
    }

    const { name, pdfUrl, categoryId, disciplineId, teacherId } = formData;

    try {
      await api.addTest({ name, pdfUrl, categoryId, disciplineId, teacherId });
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
          name="name"
          sx={styles.input}
          label="Título da prova"
          type="text"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.name}
        />
        <TextField
          name="pdfUrl"
          sx={styles.input}
          label="PDF da prova"
          type="text"
          variant="outlined"
          onChange={handleInputChange}
          value={formData.pdfUrl}
        />

          <FormControl fullWidth>
            <InputLabel>Categoria</InputLabel>
            <Select
                sx={styles.input}
                value={formData.categoryId}
                label="Categoria"
                onChange={handleSelectChange}
                name='categoryId'
            >
                {categories.map((category) => <MenuItem value={category.id}>{category.name}</MenuItem>)}
                
            </Select>
            </FormControl>
            <FormControl fullWidth>
            <InputLabel>Disciplina</InputLabel>
            <Select
                sx={styles.input}
                value={formData.disciplineId}
                label="Disciplina"
                onChange={handleSelectChange}
                name='disciplineId'
            >
                {teachersDisciplines.map((item) => <MenuItem value={item.discipline.id}>{item.discipline.name}</MenuItem>)}
                
            </Select>
            </FormControl>
       
            <FormControl fullWidth>
            <InputLabel>Pessoa instrutora</InputLabel>
            <Select
                sx={styles.input}
                value={formData.teacherId}
                label="Pessoa Instrutora"
                onChange={handleSelectChange}
                name='teacherId'
            >
                {teachersDisciplines.map((item) => <MenuItem value={item.teacher.id}>{item.teacher.name}</MenuItem>)}
                
            </Select>
            </FormControl>
       
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
