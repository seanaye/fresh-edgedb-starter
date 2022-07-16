CREATE MIGRATION m1dx646fuaofdnoyzptoxut7fhcbn2txjsmfxqq3v6cm6t23kywuhq
    ONTO initial
{
  CREATE TYPE default::User {
      CREATE REQUIRED PROPERTY age -> std::int16;
      CREATE REQUIRED PROPERTY name -> std::str;
  };
};
