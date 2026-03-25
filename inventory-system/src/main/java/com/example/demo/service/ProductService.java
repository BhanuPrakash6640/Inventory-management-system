package com.example.demo.service;
import com.example.demo.model.Product;
import com.example.demo.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductService {
    @Autowired
    private ProductRepository repo;

    public Product save(Product p) { return repo.save(p); }
    public List<Product> getAll() { return repo.findAll(); }
    public void delete(String id) { repo.deleteById(id); }
}
