import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Divider,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SetAccessorDeclaration } from "typescript";
import useAuth from "../hooks/useAuth";
import api, {
  Category,
  Discipline,
  SearchByDiscipline,
  TeacherDisciplines,
  Test,
  TestByDiscipline,
} from "../services/api";
import { useSearchParams } from "react-router-dom";

function Search() {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [terms, setTerms] = useState<TestByDiscipline[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchText, setSearchText] = useState("");
  const [tests, setTests] = useState<SearchByDiscipline[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
    

  useEffect(() => {
    async function loadPage() {
        const key = searchParams.get("key")
        if (!token || !key) return;
        setSearchText(key)
      const { data: searchData } = await api.searchByDiscipline(key, token);
      setTests(searchData.tests)
    }
    loadPage();
  }, [token]);

  async function handleSubmit(e: React.KeyboardEvent<HTMLDivElement> ){
    if (e.key === 'Enter'){ 
      if (!token) return;
      const { data: searchData } = await api.searchByDiscipline(searchText, token);
      setTests(searchData.tests)
      console.log(searchData.tests)
    }
  }  

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>){
    setSearchText(e.target.value);
  }

  return (
    <>
      <TextField
        name="searchBox"
        sx={{ marginX: "auto", marginBottom: "25px", width: "450px" }}
        label="Pesquise por disciplina"
        type="text"
        variant="outlined"
        onChange={handleInputChange}
        value={searchText}
        onKeyDown={handleSubmit}
      />
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
            variant="contained"
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
          <Button variant="outlined" onClick={() => navigate("/app/adicionar")}>
            Adicionar
          </Button>
        </Box>
        <DisciplinesAccordions disciplines={tests} />
      </Box>
    </>
  );
}

interface DisciplinesAccordionsProps {
  disciplines: SearchByDiscipline[];
}

function DisciplinesAccordions({ disciplines }: DisciplinesAccordionsProps) {
  return (
    <Box sx={{ marginTop: "50px" }}>
      {disciplines.map((discipline) => (
        <Accordion sx={{ backgroundColor: "#FFF" }} key={discipline.id}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">{discipline.name}</Typography>
          </AccordionSummary>
          <AccordionDetails>
              {discipline.teacherDisciplines.map((item) => 
                item.tests.map((test) => 
                    test.name))}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}

export default Search;
